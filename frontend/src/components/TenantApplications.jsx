import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, Grid, Button, TextField,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, MenuItem, Select, Stack, LinearProgress, Divider, Alert
} from '@mui/material';
import {
  AssignmentInd as ApplicationIcon,
  Add as AddIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  CloudUpload as UploadIcon,
  Checklist as ChecklistIcon,
  Description as DocIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import Navigation from './Navigation';
import useAutoLogout from '../hooks/useAutoLogout';
import api from '../services/api';

const TenantApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [openApplyModal, setOpenApplyModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const userRole = localStorage.getItem('userRole') || 'SUPER_ADMINISTRATOR';

  // Rental Application Form State
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('Renta High-Rise Apartments');
  const [selectedUnit, setSelectedUnit] = useState('A-101');
  const [employerName, setEmployerName] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState(85000);
  const [docUrl, setDocUrl] = useState('');

  useAutoLogout();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    setLoading(true);
    try {
      const local = localStorage.getItem('tenant_applications');
      let appList = local ? JSON.parse(local) : [];

      if (appList.length === 0) {
        appList = [
          {
            id: 1,
            applicantName: 'David Kamau',
            email: 'david.kamau@gmail.com',
            phone: '0712345678',
            property: 'Renta High-Rise Apartments',
            unit: 'A-103',
            employer: 'Safcom Tech Ltd',
            monthlyIncome: 95000,
            status: 'PENDING',
            docUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
            submittedAt: '2025-02-12',
            notes: 'Verified employment status and payslip.',
            checklist: { idVerified: true, incomeVerified: true, depositPaid: false, leaseSigned: false }
          },
          {
            id: 2,
            applicantName: 'Sarah Wanjiku',
            email: 'sarah.w@gmail.com',
            phone: '0722987654',
            property: 'Modular Luxury Townhouses',
            unit: 'T-203',
            employer: 'Equity Bank',
            monthlyIncome: 120000,
            status: 'UNDER_REVIEW',
            docUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
            submittedAt: '2025-02-10',
            notes: 'Underwriting background check in progress.',
            checklist: { idVerified: true, incomeVerified: true, depositPaid: true, leaseSigned: false }
          }
        ];
        localStorage.setItem('tenant_applications', JSON.stringify(appList));
      }

      setApplications(appList);
      setFilteredApps(appList);
    } catch (e) {
      console.error('Error fetching applications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = applications;
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.property.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredApps(filtered);
  }, [searchTerm, statusFilter, applications]);

  // Submit New Rental Application
  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) return;

    const newApp = {
      id: Date.now(),
      applicantName,
      email: applicantEmail,
      phone: applicantPhone,
      property: selectedProperty,
      unit: selectedUnit,
      employer: employerName,
      monthlyIncome: parseFloat(monthlyIncome),
      status: 'PENDING',
      docUrl: docUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      submittedAt: new Date().toISOString().split('T')[0],
      notes: 'New rental application submitted by applicant.',
      checklist: { idVerified: true, incomeVerified: true, depositPaid: false, leaseSigned: false }
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    localStorage.setItem('tenant_applications', JSON.stringify(updated));

    setOpenApplyModal(false);
    setApplicantName('');
    setApplicantEmail('');
    setApplicantPhone('');
  };

  // Change Application Status (Approve / Reject / Under Review)
  const handleUpdateStatus = (appId, newStatus) => {
    const updated = applications.map(a => {
      if (a.id === appId) {
        const isApproved = newStatus === 'APPROVED';
        return {
          ...a,
          status: newStatus,
          checklist: {
            ...a.checklist,
            idVerified: true,
            incomeVerified: true,
            depositPaid: isApproved ? true : a.checklist.depositPaid,
            leaseSigned: isApproved ? true : a.checklist.leaseSigned
          }
        };
      }
      return a;
    });

    setApplications(updated);
    localStorage.setItem('tenant_applications', JSON.stringify(updated));

    // If approved, update custom_properties unit status to RESERVED / OCCUPIED
    if (newStatus === 'APPROVED') {
      const targetApp = applications.find(a => a.id === appId);
      if (targetApp) {
        const localProps = JSON.parse(localStorage.getItem('custom_properties') || '[]');
        localProps.forEach(p => {
          if (p.name === targetApp.property && p.units) {
            p.units.forEach(u => {
              if (u.unitNumber === targetApp.unit) {
                u.status = 'RESERVED';
                u.tenantName = targetApp.applicantName;
              }
            });
          }
        });
        localStorage.setItem('custom_properties', JSON.stringify(localProps));
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, pt: { xs: 10, md: 11 }, px: { xs: 2, sm: 4 }, pb: 6, width: { md: `calc(100% - 260px)` } }}>
        <Container maxWidth="xl" disableGutters>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight={700} color="#0f172a">
                <ApplicationIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '2.2rem', color: '#1976d2' }} />
                Tenant Applications &amp; Screening Portal
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Automated applicant screening, document verification, approval workflow, and unit reservation
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenApplyModal(true)}
              sx={{ fontWeight: 700, borderRadius: 2, px: 3, py: 1.2 }}
            >
              Submit Rental Application
            </Button>
          </Box>

          <Card sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search applicant name, email, or property..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Select
                  fullWidth
                  size="small"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="ALL">All Application Statuses</MenuItem>
                  <MenuItem value="PENDING">Pending Review</MenuItem>
                  <MenuItem value="UNDER_REVIEW">Under Screening</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Card>

          {/* Applications Table */}
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, boxShadow: 1 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell fontWeight={700}>Applicant</TableCell>
                  <TableCell fontWeight={700}>Property &amp; Unit</TableCell>
                  <TableCell fontWeight={700}>Income / Employer</TableCell>
                  <TableCell fontWeight={700}>Status</TableCell>
                  <TableCell fontWeight={700}>Onboarding Checklist</TableCell>
                  <TableCell fontWeight={700} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApps.map((app) => (
                  <TableRow key={app.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>{app.applicantName}</Typography>
                      <Typography variant="caption" color="text.secondary">{app.email} • {app.phone}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary">{app.property}</Typography>
                      <Chip label={`Unit ${app.unit}`} size="small" variant="outlined" sx={{ fontWeight: 700, mt: 0.5 }} />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>KSh {app.monthlyIncome?.toLocaleString()}/mo</Typography>
                      <Typography variant="caption" color="text.secondary">{app.employer}</Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={app.status.replace('_', ' ')}
                        color={
                          app.status === 'APPROVED' ? 'success' :
                          app.status === 'REJECTED' ? 'error' :
                          app.status === 'UNDER_REVIEW' ? 'warning' : 'info'
                        }
                        size="small"
                        sx={{ fontWeight: 800 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" color={app.checklist?.idVerified ? 'success.main' : 'text.secondary'} fontWeight={600}>
                          {app.checklist?.idVerified ? '✓ ID Verified' : '○ Pending ID'}
                        </Typography>
                        <Typography variant="caption" color={app.checklist?.depositPaid ? 'success.main' : 'text.secondary'} fontWeight={600}>
                          {app.checklist?.depositPaid ? '✓ Deposit Settled' : '○ Deposit Pending'}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {app.status !== 'APPROVED' && (
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<ApproveIcon fontSize="small" />}
                            onClick={() => handleUpdateStatus(app.id, 'APPROVED')}
                            sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                          >
                            Approve
                          </Button>
                        )}
                        {app.status !== 'REJECTED' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<RejectIcon fontSize="small" />}
                            onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                            sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                          >
                            Reject
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* RENTAL APPLICATION MODAL */}
          <Dialog open={openApplyModal} onClose={() => setOpenApplyModal(false)} maxWidth="sm" fullWidth>
            <DialogTitle fontWeight={700}>Submit Digital Rental Application</DialogTitle>
            <form onSubmit={handleSubmitApplication}>
              <DialogContent>
                <Stack spacing={2} pt={1}>
                  <TextField
                    label="Applicant Full Name"
                    fullWidth
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                  />
                  <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    required
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                  />
                  <TextField
                    label="Phone Number"
                    fullWidth
                    required
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Employer / Business Name"
                        fullWidth
                        value={employerName}
                        onChange={(e) => setEmployerName(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Monthly Gross Income (KSh)"
                        type="number"
                        fullWidth
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    label="ID Card / Payslip Document URL"
                    fullWidth
                    placeholder="https://... or upload scan"
                    value={docUrl}
                    onChange={(e) => setDocUrl(e.target.value)}
                  />
                </Stack>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setOpenApplyModal(false)}>Cancel</Button>
                <Button type="submit" variant="contained">Submit Application</Button>
              </DialogActions>
            </form>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default TenantApplications;

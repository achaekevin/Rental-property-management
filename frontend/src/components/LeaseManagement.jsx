import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, Grid, Button, TextField,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, MenuItem, Select, Stack, Divider, Alert
} from '@mui/material';
import {
  Description as LeaseIcon,
  Add as AddIcon,
  Create as SignatureIcon,
  PictureAsPdf as PdfIcon,
  Autorenew as RenewalIcon,
  Event as EventIcon,
  MonetizationOn as MoneyIcon,
  CheckCircle as ActiveIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import Navigation from './Navigation';
import useAutoLogout from '../hooks/useAutoLogout';
import { exportToPDF } from '../utils/exportUtils';
import api from '../services/api';

const LeaseManagement = () => {
  const [leases, setLeases] = useState([]);
  const [filteredLeases, setFilteredLeases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const userRole = localStorage.getItem('userRole') || 'SUPER_ADMINISTRATOR';

  // Lease Creation Form State
  const [tenantName, setTenantName] = useState('');
  const [propertyName, setPropertyName] = useState('Renta High-Rise Apartments');
  const [unitNumber, setUnitNumber] = useState('A-101');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2026-01-01');
  const [monthlyRent, setMonthlyRent] = useState(35000);
  const [securityDeposit, setSecurityDeposit] = useState(70000);
  const [gracePeriodDays, setGracePeriodDays] = useState(5);
  const [lateFeePercent, setLateFeePercent] = useState(5);

  useAutoLogout();

  useEffect(() => {
    fetchLeases();
  }, []);

  const fetchLeases = () => {
    setLoading(true);
    try {
      const local = localStorage.getItem('system_leases');
      let leaseList = local ? JSON.parse(local) : [];

      if (leaseList.length === 0) {
        leaseList = [
          {
            id: 1,
            leaseNo: 'LSE-2025-001',
            tenant: 'Tenant User',
            property: 'Renta High-Rise Apartments',
            unit: 'A-104',
            startDate: '2025-01-01',
            endDate: '2026-01-01',
            monthlyRent: 35000,
            securityDeposit: 70000,
            gracePeriodDays: 5,
            lateFeePercent: 5,
            status: 'ACTIVE',
            signatures: { tenantSigned: true, landlordSigned: true },
            createdAt: '2025-01-01'
          },
          {
            id: 2,
            leaseNo: 'LSE-2025-002',
            tenant: 'John Doe',
            property: 'Modular Luxury Townhouses',
            unit: 'T-201',
            startDate: '2025-02-01',
            endDate: '2026-02-01',
            monthlyRent: 45000,
            securityDeposit: 90000,
            gracePeriodDays: 5,
            lateFeePercent: 5,
            status: 'SIGNED',
            signatures: { tenantSigned: true, landlordSigned: false },
            createdAt: '2025-01-28'
          }
        ];
        localStorage.setItem('system_leases', JSON.stringify(leaseList));
      }

      setLeases(leaseList);
      setFilteredLeases(leaseList);
    } catch (e) {
      console.error('Error loading leases:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = leases;
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(l => l.status === statusFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(l =>
        l.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.leaseNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredLeases(filtered);
  }, [searchTerm, statusFilter, leases]);

  // Create New Lease Draft
  const handleCreateLease = (e) => {
    e.preventDefault();
    if (!tenantName || !propertyName) return;

    const leaseNo = `LSE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newLease = {
      id: Date.now(),
      leaseNo,
      tenant: tenantName,
      property: propertyName,
      unit: unitNumber,
      startDate,
      endDate,
      monthlyRent: parseFloat(monthlyRent),
      securityDeposit: parseFloat(securityDeposit),
      gracePeriodDays: parseInt(gracePeriodDays, 10),
      lateFeePercent: parseFloat(lateFeePercent),
      status: 'DRAFT',
      signatures: { tenantSigned: false, landlordSigned: false },
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newLease, ...leases];
    setLeases(updated);
    localStorage.setItem('system_leases', JSON.stringify(updated));

    setOpenCreateModal(false);
    setTenantName('');
  };

  // Execute Digital Signature (Tenant or Landlord)
  const handleDigitalSign = (leaseId, roleSign) => {
    const updated = leases.map(l => {
      if (l.id === leaseId) {
        const sigs = { ...l.signatures, [roleSign]: true };
        const bothSigned = sigs.tenantSigned && sigs.landlordSigned;
        return {
          ...l,
          signatures: sigs,
          status: bothSigned ? 'ACTIVE' : 'SIGNED'
        };
      }
      return l;
    });

    setLeases(updated);
    localStorage.setItem('system_leases', JSON.stringify(updated));
  };

  // Download Printable PDF Lease Agreement
  const handleDownloadLeasePDF = (lease) => {
    const summary = [
      { label: 'LEASE REFERENCE NUMBER', value: lease.leaseNo },
      { label: 'TENANT NAME', value: lease.tenant },
      { label: 'PROPERTY NAME', value: lease.property },
      { label: 'ASSIGNED UNIT', value: lease.unit },
      { label: 'LEASE START DATE', value: lease.startDate },
      { label: 'LEASE EXPIRATION DATE', value: lease.endDate },
      { label: 'MONTHLY RENT AMOUNT', value: `KSh ${lease.monthlyRent.toLocaleString()}` },
      { label: 'SECURITY DEPOSIT HELD', value: `KSh ${lease.securityDeposit.toLocaleString()}` },
      { label: 'GRACE PERIOD & LATE FEE', value: `${lease.gracePeriodDays} Days Grace (${lease.lateFeePercent}% Late Fee)` },
      { label: 'DIGITAL SIGNATURES', value: `Tenant: ${lease.signatures?.tenantSigned ? 'SIGNED' : 'PENDING'} | Landlord: ${lease.signatures?.landlordSigned ? 'SIGNED' : 'PENDING'}` }
    ];

    exportToPDF(`OFFICIAL LEASE AGREEMENT (${lease.leaseNo})`, summary, [], [], `Lease_Agreement_${lease.leaseNo}`);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, pt: { xs: 10, md: 11 }, px: { xs: 2, sm: 4 }, pb: 6, width: { md: `calc(100% - 260px)` } }}>
        <Container maxWidth="xl" disableGutters>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight={700} color="#0f172a">
                <LeaseIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '2.2rem', color: '#1976d2' }} />
                Comprehensive Lease Management &amp; Digital Signatures
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Lease creation, digital signature execution, late-fee rules, renewals, and legal agreements
              </Typography>
            </Box>

            {(userRole === 'SUPER_ADMINISTRATOR' || userRole === 'PROPERTY_MANAGER') && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setOpenCreateModal(true)}
                sx={{ fontWeight: 700, borderRadius: 2, px: 3, py: 1.2 }}
              >
                Create New Lease Draft
              </Button>
            )}
          </Box>

          <Card sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by lease #, tenant name, or property..."
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
                  <MenuItem value="ALL">All Lease Lifecycle Statuses</MenuItem>
                  <MenuItem value="DRAFT">Draft</MenuItem>
                  <MenuItem value="SIGNED">Signed</MenuItem>
                  <MenuItem value="ACTIVE">Active Tenancy</MenuItem>
                  <MenuItem value="RENEWAL">Renewal Pending</MenuItem>
                  <MenuItem value="EXPIRED">Expired / Terminated</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Card>

          {/* Lease Table */}
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, boxShadow: 1 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell fontWeight={700}>Lease #</TableCell>
                  <TableCell fontWeight={700}>Tenant &amp; Property</TableCell>
                  <TableCell fontWeight={700}>Term &amp; Expiration</TableCell>
                  <TableCell fontWeight={700}>Monthly Rent / Deposit</TableCell>
                  <TableCell fontWeight={700}>Late Fee Rules</TableCell>
                  <TableCell fontWeight={700}>Status &amp; Signatures</TableCell>
                  <TableCell fontWeight={700} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeases.map((lease) => (
                  <TableRow key={lease.id} hover>
                    <TableCell fontWeight={700} color="primary">{lease.leaseNo}</TableCell>

                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>{lease.tenant}</Typography>
                      <Typography variant="caption" color="text.secondary">{lease.property} • Unit {lease.unit}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{lease.startDate} to {lease.endDate}</Typography>
                      <Typography variant="caption" color="info.main" display="block">12 Months Term</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>KSh {lease.monthlyRent?.toLocaleString()}/mo</Typography>
                      <Typography variant="caption" color="text.secondary">Deposit: KSh {lease.securityDeposit?.toLocaleString()}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="caption" display="block">Grace: <strong>{lease.gracePeriodDays} Days</strong></Typography>
                      <Typography variant="caption" display="block">Late Fee: <strong>{lease.lateFeePercent}% after grace</strong></Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={lease.status}
                        color={
                          lease.status === 'ACTIVE' ? 'success' :
                          lease.status === 'SIGNED' ? 'info' :
                          lease.status === 'DRAFT' ? 'default' : 'warning'
                        }
                        size="small"
                        sx={{ fontWeight: 800, mb: 0.5 }}
                      />
                      <Stack direction="row" spacing={0.5}>
                        <Chip
                          label={lease.signatures?.tenantSigned ? 'Tenant Signed ✓' : 'Tenant Pending'}
                          color={lease.signatures?.tenantSigned ? 'success' : 'default'}
                          size="small"
                          sx={{ fontSize: '0.62rem', height: 18 }}
                        />
                        <Chip
                          label={lease.signatures?.landlordSigned ? 'Owner Signed ✓' : 'Owner Pending'}
                          color={lease.signatures?.landlordSigned ? 'success' : 'default'}
                          size="small"
                          sx={{ fontSize: '0.62rem', height: 18 }}
                        />
                      </Stack>
                    </TableCell>

                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {!lease.signatures?.tenantSigned && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            startIcon={<SignatureIcon fontSize="small" />}
                            onClick={() => handleDigitalSign(lease.id, 'tenantSigned')}
                            sx={{ fontSize: '0.72rem', textTransform: 'none' }}
                          >
                            Sign (Tenant)
                          </Button>
                        )}
                        {!lease.signatures?.landlordSigned && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="secondary"
                            startIcon={<SignatureIcon fontSize="small" />}
                            onClick={() => handleDigitalSign(lease.id, 'landlordSigned')}
                            sx={{ fontSize: '0.72rem', textTransform: 'none' }}
                          >
                            Sign (Owner)
                          </Button>
                        )}
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          startIcon={<PdfIcon fontSize="small" />}
                          onClick={() => handleDownloadLeasePDF(lease)}
                          sx={{ fontSize: '0.72rem', textTransform: 'none' }}
                        >
                          PDF Lease
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* CREATE LEASE DRAFT MODAL */}
          <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} maxWidth="sm" fullWidth>
            <DialogTitle fontWeight={700}>Create New Lease Draft &amp; Agreement</DialogTitle>
            <form onSubmit={handleCreateLease}>
              <DialogContent>
                <Stack spacing={2} pt={1}>
                  <TextField
                    label="Tenant Full Name"
                    fullWidth
                    required
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Property Name"
                        fullWidth
                        value={propertyName}
                        onChange={(e) => setPropertyName(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Unit Number"
                        fullWidth
                        value={unitNumber}
                        onChange={(e) => setUnitNumber(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Start Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="End Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Monthly Rent (KSh)"
                        type="number"
                        fullWidth
                        value={monthlyRent}
                        onChange={(e) => setMonthlyRent(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Security Deposit (KSh)"
                        type="number"
                        fullWidth
                        value={securityDeposit}
                        onChange={(e) => setSecurityDeposit(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Grace Period (Days)"
                        type="number"
                        fullWidth
                        value={gracePeriodDays}
                        onChange={(e) => setGracePeriodDays(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Late Fee Percentage (%)"
                        type="number"
                        fullWidth
                        value={lateFeePercent}
                        onChange={(e) => setLateFeePercent(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setOpenCreateModal(false)}>Cancel</Button>
                <Button type="submit" variant="contained">Generate Lease Draft</Button>
              </DialogActions>
            </form>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default LeaseManagement;

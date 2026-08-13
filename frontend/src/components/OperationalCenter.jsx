import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, Grid, Button, TextField,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, MenuItem, Select, Stack, Tabs, Tab, Alert, Divider
} from '@mui/material';
import {
  Warning as ArrearsIcon,
  Engineering as VendorIcon,
  FactCheck as InspectionIcon,
  Speed as MeterIcon,
  Add as AddIcon,
  Search as SearchIcon,
  PictureAsPdf as PdfIcon,
  TrendingDown as RiskIcon,
  CompareArrows as CompareIcon
} from '@mui/icons-material';
import Navigation from './Navigation';
import useAutoLogout from '../hooks/useAutoLogout';
import { exportToPDF } from '../utils/exportUtils';

const OperationalCenter = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const userRole = localStorage.getItem('userRole') || 'SUPER_ADMINISTRATOR';

  // 1. Arrears & Aging Data
  const [arrearsList, setArrearsList] = useState([
    { id: 1, tenant: 'Tenant User', property: 'Renta High-Rise Apartments', unit: 'A-104', balance: 25000, ageDays: 5, risk: 'LOW_RISK', lastContact: '2025-02-10', promiseDate: '2025-02-15' },
    { id: 2, tenant: 'John Doe', property: 'Modular Luxury Townhouses', unit: 'T-201', balance: 50000, ageDays: 31, risk: 'MEDIUM_RISK', lastContact: '2025-02-01', promiseDate: '2025-02-18' },
    { id: 3, tenant: 'Mark Otieno', property: 'Renta High-Rise Apartments', unit: 'A-108', balance: 75000, ageDays: 64, risk: 'HIGH_RISK', lastContact: '2025-01-15', promiseDate: 'Overdue' }
  ]);

  // 2. Vendor Management Data
  const [vendors, setVendors] = useState([
    { id: 1, name: 'Nairobi Express Plumbing Ltd', service: 'Plumbing & Drainage', phone: '0711000111', rating: 4.9, activeOrders: 2, totalPaid: 85000 },
    { id: 2, name: 'PowerGrid Electrical Services', service: 'Electrical & Solar', phone: '0722000222', rating: 4.8, activeOrders: 1, totalPaid: 120000 },
    { id: 3, name: 'Sparkle Cleaners & Facility', service: 'Deep Cleaning & Janitorial', phone: '0733000333', rating: 4.7, activeOrders: 0, totalPaid: 45000 }
  ]);

  // 3. Inspections & Move-in vs Move-out Comparison Data
  const [inspections, setInspections] = useState([
    {
      id: 1,
      property: 'Renta High-Rise Apartments',
      unit: 'A-104',
      tenant: 'Tenant User',
      moveInDate: '2025-01-01',
      moveOutDate: '2026-01-01',
      moveInCondition: { walls: 'Good', floors: 'Good', doors: 'Good', plumbing: 'Good' },
      moveOutCondition: { walls: 'Damaged (Scratches)', floors: 'Good', doors: 'Damaged (Hinge)', plumbing: 'Good' },
      deductionAmount: 8500,
      depositHeld: 70000,
      refundAmount: 61500,
      status: 'ASSESSED'
    }
  ]);

  // 4. Utility Meter Readings Data
  const [meters, setMeters] = useState([
    { id: 1, property: 'Renta High-Rise Apartments', unit: 'A-104', utilityType: 'Water', prevReading: 1240, currReading: 1268, consumption: 28, ratePerUnit: 50, totalBill: 1400 },
    { id: 2, property: 'Modular Luxury Townhouses', unit: 'T-201', utilityType: 'Electricity', prevReading: 4500, currReading: 4680, consumption: 180, ratePerUnit: 25, totalBill: 4500 }
  ]);

  useAutoLogout();

  // Export Arrears Report PDF
  const handleExportArrearsPDF = () => {
    const summary = arrearsList.map(a => ({
      label: `${a.tenant} (${a.unit})`,
      value: `Balance: KSh ${a.balance.toLocaleString()} | Overdue: ${a.ageDays} Days | Risk: ${a.risk}`
    }));
    exportToPDF('ARREARS & AGING ANALYSIS REPORT', summary, [], [], 'Arrears_Aging_Report');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, pt: { xs: 10, md: 11 }, px: { xs: 2, sm: 4 }, pb: 6, width: { md: `calc(100% - 260px)` } }}>
        <Container maxWidth="xl" disableGutters>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight={700} color="#0f172a">
                Operational Control &amp; Arrears Management Tower
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Arrears aging analysis, vendor work orders, move-in/move-out inspections, and utility meter billing
              </Typography>
            </Box>

            <Button variant="outlined" color="error" startIcon={<PdfIcon />} onClick={handleExportArrearsPDF} sx={{ fontWeight: 700 }}>
              Export Arrears Report (PDF)
            </Button>
          </Box>

          <Paper sx={{ mb: 4, borderRadius: 2 }}>
            <Tabs
              value={tabIndex}
              onChange={(e, val) => setTabIndex(val)}
              variant="scrollable"
              scrollButtons="auto"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab icon={<ArrearsIcon />} label="Arrears &amp; Aging Analysis" sx={{ fontWeight: 700 }} />
              <Tab icon={<VendorIcon />} label="Vendor Management &amp; Work Orders" sx={{ fontWeight: 700 }} />
              <Tab icon={<InspectionIcon />} label="Move-In vs Move-Out Inspections" sx={{ fontWeight: 700 }} />
              <Tab icon={<MeterIcon />} label="Utility Meter Readings &amp; Rates" sx={{ fontWeight: 700 }} />
            </Tabs>
          </Paper>

          {/* TAB 0: ARREARS & AGING ANALYSIS */}
          {tabIndex === 0 && (
            <Box>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ p: 2, borderLeft: '4px solid #ef4444' }}>
                    <Typography variant="subtitle2" color="text.secondary">1 - 30 Days Overdue</Typography>
                    <Typography variant="h4" fontWeight={700} color="error.main">KSh 25,000</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ p: 2, borderLeft: '4px solid #f59e0b' }}>
                    <Typography variant="subtitle2" color="text.secondary">31 - 60 Days Overdue</Typography>
                    <Typography variant="h4" fontWeight={700} color="warning.main">KSh 50,000</Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card sx={{ p: 2, borderLeft: '4px solid #991b1b' }}>
                    <Typography variant="subtitle2" color="text.secondary">60+ Days Overdue (High Risk)</Typography>
                    <Typography variant="h4" fontWeight={700} color="error.dark">KSh 75,000</Typography>
                  </Card>
                </Grid>
              </Grid>

              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell fontWeight={700}>Tenant Name</TableCell>
                      <TableCell fontWeight={700}>Property &amp; Unit</TableCell>
                      <TableCell fontWeight={700}>Balance (KSh)</TableCell>
                      <TableCell fontWeight={700}>Aging (Days)</TableCell>
                      <TableCell fontWeight={700}>Risk Level</TableCell>
                      <TableCell fontWeight={700}>Payment Promise Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {arrearsList.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell fontWeight={700}>{item.tenant}</TableCell>
                        <TableCell>{item.property} ({item.unit})</TableCell>
                        <TableCell fontWeight={700} color="error.main">KSh {item.balance.toLocaleString()}</TableCell>
                        <TableCell><Chip label={`${item.ageDays} Days`} size="small" color={item.ageDays > 60 ? 'error' : item.ageDays > 30 ? 'warning' : 'info'} /></TableCell>
                        <TableCell>
                          <Chip
                            label={item.risk.replace('_', ' ')}
                            color={item.risk === 'HIGH_RISK' ? 'error' : item.risk === 'MEDIUM_RISK' ? 'warning' : 'success'}
                            size="small"
                            sx={{ fontWeight: 800 }}
                          />
                        </TableCell>
                        <TableCell>{item.promiseDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* TAB 1: VENDOR MANAGEMENT */}
          {tabIndex === 1 && (
            <Box>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell fontWeight={700}>Vendor Name</TableCell>
                      <TableCell fontWeight={700}>Service Specialty</TableCell>
                      <TableCell fontWeight={700}>Contact Phone</TableCell>
                      <TableCell fontWeight={700}>Rating</TableCell>
                      <TableCell fontWeight={700}>Active Work Orders</TableCell>
                      <TableCell fontWeight={700}>Total Paid (KSh)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vendors.map((v) => (
                      <TableRow key={v.id} hover>
                        <TableCell fontWeight={700}>{v.name}</TableCell>
                        <TableCell><Chip label={v.service} size="small" color="primary" variant="outlined" /></TableCell>
                        <TableCell>{v.phone}</TableCell>
                        <TableCell>⭐ {v.rating} / 5.0</TableCell>
                        <TableCell><Chip label={`${v.activeOrders} Active`} size="small" color="info" /></TableCell>
                        <TableCell fontWeight={700}>KSh {v.totalPaid.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* TAB 2: INSPECTIONS & MOVE-IN VS MOVE-OUT COMPARISON */}
          {tabIndex === 2 && (
            <Box>
              {inspections.map((insp) => (
                <Card key={insp.id} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight={700} color="primary" mb={1}>
                    <CompareIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Move-In vs Move-Out Inspection Report: {insp.property} ({insp.unit})
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Tenant: <strong>{insp.tenant}</strong> • Move-In: <strong>{insp.moveInDate}</strong> | Move-Out: <strong>{insp.moveOutDate}</strong>
                  </Typography>

                  <Grid container spacing={3} mb={2}>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f0fdf4' }}>
                        <Typography variant="subtitle2" fontWeight={700} color="success.main" mb={1}>
                          Move-In Condition Log
                        </Typography>
                        <Typography variant="caption" display="block">Walls: {insp.moveInCondition.walls}</Typography>
                        <Typography variant="caption" display="block">Floors: {insp.moveInCondition.floors}</Typography>
                        <Typography variant="caption" display="block">Doors: {insp.moveInCondition.doors}</Typography>
                        <Typography variant="caption" display="block">Plumbing: {insp.moveInCondition.plumbing}</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fef2f2' }}>
                        <Typography variant="subtitle2" fontWeight={700} color="error.main" mb={1}>
                          Move-Out Inspection Assessment
                        </Typography>
                        <Typography variant="caption" display="block" color="error.main">Walls: {insp.moveOutCondition.walls}</Typography>
                        <Typography variant="caption" display="block">Floors: {insp.moveOutCondition.floors}</Typography>
                        <Typography variant="caption" display="block" color="error.main">Doors: {insp.moveOutCondition.doors}</Typography>
                        <Typography variant="caption" display="block">Plumbing: {insp.moveOutCondition.plumbing}</Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Box p={2} bgcolor="#f8fafc" borderRadius={2} border="1px solid #cbd5e1" display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="caption" display="block">Deposit Held: <strong>KSh {insp.depositHeld.toLocaleString()}</strong></Typography>
                      <Typography variant="caption" display="block" color="error.main">Assessed Damage Deductions: <strong>- KSh {insp.deductionAmount.toLocaleString()}</strong></Typography>
                    </Box>
                    <Chip label={`Net Refund: KSh ${insp.refundAmount.toLocaleString()}`} color="success" sx={{ fontWeight: 800, fontSize: '0.9rem', py: 1 }} />
                  </Box>
                </Card>
              ))}
            </Box>
          )}

          {/* TAB 3: UTILITY METER READINGS */}
          {tabIndex === 3 && (
            <Box>
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell fontWeight={700}>Property &amp; Unit</TableCell>
                      <TableCell fontWeight={700}>Utility Type</TableCell>
                      <TableCell fontWeight={700}>Previous Reading</TableCell>
                      <TableCell fontWeight={700}>Current Reading</TableCell>
                      <TableCell fontWeight={700}>Consumption (Units)</TableCell>
                      <TableCell fontWeight={700}>Rate per Unit</TableCell>
                      <TableCell fontWeight={700}>Calculated Bill (KSh)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {meters.map((m) => (
                      <TableRow key={m.id} hover>
                        <TableCell fontWeight={700}>{m.property} ({m.unit})</TableCell>
                        <TableCell><Chip label={m.utilityType} color={m.utilityType === 'Water' ? 'info' : 'warning'} size="small" sx={{ fontWeight: 700 }} /></TableCell>
                        <TableCell>{m.prevReading}</TableCell>
                        <TableCell>{m.currReading}</TableCell>
                        <TableCell fontWeight={700}>{m.consumption} units</TableCell>
                        <TableCell>KSh {m.ratePerUnit}/unit</TableCell>
                        <TableCell fontWeight={800} color="primary.main">KSh {m.totalBill.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default OperationalCenter;

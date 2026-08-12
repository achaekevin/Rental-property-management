import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Navigation from './Navigation';
import {
  Box,
  Container,
  Card,
  Typography,
  Chip,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  AttachMoney as AttachMoneyIcon,
  Add as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import api from '../services/api';

const RentPayment = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Record Payment Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('M-Pesa');
  const [tenantName, setTenantName] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [unit, setUnit] = useState('');
  const [saving, setSaving] = useState(false);

  // Notification State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/payments');
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        const paymentRecords = res.data.data.map((p, index) => ({
          id: p.id || index + 1,
          tenant: p.tenantName || p.tenant?.name || 'Tenant User',
          property: p.propertyName || p.property?.name || 'Renta Property',
          unit: p.unitNumber || 'A-101',
          amount: parseFloat(p.amount || 0),
          dueDate: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          status: p.status || 'SUCCESS',
          paymentMethod: p.paymentMethod || 'M-Pesa'
        }));
        setRows(paymentRecords);
        setFilteredRows(paymentRecords);
      } else {
        setRows([]);
        setFilteredRows([]);
      }
    } catch (error) {
      console.error('Error fetching real payments:', error);
      setRows([]);
      setFilteredRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = rows;
    if (selectedStatus !== 'All') {
      filtered = filtered.filter((row) => row.status === selectedStatus);
    }
    if (searchQuery) {
      filtered = filtered.filter((row) =>
        row.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.property.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredRows(filtered);
  }, [rows, selectedStatus, searchQuery]);

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!amount) return;

    setSaving(true);
    try {
      const res = await api.post('/payments', {
        amount: parseFloat(amount),
        paymentMethod,
        tenantName,
        propertyName,
        unitNumber: unit,
        status: 'SUCCESS'
      });

      if (res.data && res.data.success) {
        setSnackbarMessage('Rent payment recorded and saved to database successfully!');
        setSnackbarOpen(true);
        setOpenDialog(false);
        setAmount('');
        setTenantName('');
        setPropertyName('');
        setUnit('');
        fetchPayments();
      }
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || 'Failed to record payment');
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'tenant', headerName: 'Tenant', width: 180 },
    { field: 'property', headerName: 'Property', width: 160 },
    { field: 'unit', headerName: 'Unit', width: 90 },
    { 
      field: 'amount', 
      headerName: 'Amount (KSh)', 
      width: 140,
      renderCell: (params) => `KSh ${params.value.toLocaleString()}`
    },
    { field: 'dueDate', headerName: 'Date Paid', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'SUCCESS' || params.value === 'Paid' ? 'success' :
            params.value === 'PENDING' || params.value === 'Pending' ? 'warning' : 'error'
          }
          size="small"
        />
      )
    },
    { field: 'paymentMethod', headerName: 'Method', width: 110 }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Container maxWidth="xl" disableGutters>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                <AttachMoneyIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Rent Payments & Invoices
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {filteredRows.length} real payment records in database
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Record New Payment
            </Button>
          </Box>

          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                placeholder="Search real payment records by tenant or property..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{ flex: 2 }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
              <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} size="small" sx={{ minWidth: 160 }}>
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="SUCCESS">Success / Paid</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="FAILED">Failed</MenuItem>
              </Select>
            </Box>
          </Card>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2, borderLeft: '4px solid #4CAF50' }}>
                <Typography variant="subtitle2" color="text.secondary">Total Rent Collected</Typography>
                <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
                  KSh {filteredRows.filter(r => r.status === 'SUCCESS' || r.status === 'Paid').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2, borderLeft: '4px solid #FFC107' }}>
                <Typography variant="subtitle2" color="text.secondary">Pending Rent</Typography>
                <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
                  KSh {filteredRows.filter(r => r.status === 'PENDING' || r.status === 'Pending').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2, borderLeft: '4px solid #2196F3' }}>
                <Typography variant="subtitle2" color="text.secondary">Total Payment Records</Typography>
                <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
                  {filteredRows.length}
                </Typography>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ p: 2 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" py={6}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ height: 500 }}>
                <DataGrid rows={filteredRows} columns={columns} pageSizeOptions={[10, 25]} />
              </Box>
            )}
          </Card>

          {/* Record Payment Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle fontWeight={700}>Record Real Rent Payment to Database</DialogTitle>
            <form onSubmit={handleRecordPayment}>
              <DialogContent>
                <TextField
                  fullWidth
                  label="Tenant Name"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  required
                  sx={{ mb: 2, mt: 1 }}
                />
                <TextField
                  fullWidth
                  label="Property Name"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Unit Number"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. A-101"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Amount (KSh)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                <Select
                  fullWidth
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <MenuItem value="M-Pesa">M-Pesa</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Cheque">Cheque</MenuItem>
                </Select>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Payment'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
            <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </Box>
  );
};

export default RentPayment;
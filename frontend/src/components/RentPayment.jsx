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
  CircularProgress,
  Stack,
  Paper,
  Tabs,
  Tab,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  AttachMoney as AttachMoneyIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  CreditCard as CardIcon,
  PhoneAndroid as MpesaIcon,
  LocalAtm as CashIcon,
  CallSplit as SplitIcon,
  CheckCircle as CheckCircleIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import api from '../services/api';
import { useLocation } from 'react-router-dom';
import { generatePaymentReceipt } from '../utils/exportUtils';

const RentPayment = () => {
  const location = useLocation();
  const userRole = localStorage.getItem('userRole') || 'SUPER_ADMINISTRATOR';

  const [rows, setRows] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Record/Make Payment Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('M-Pesa');
  const [tenantName, setTenantName] = useState(localStorage.getItem('userName') || 'Tenant User');
  const [propertyName, setPropertyName] = useState('');
  const [unit, setUnit] = useState('');
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);

  // Payment Method Input Fields & Strict Validation
  const [mpesaPhone, setMpesaPhone] = useState('0712345678');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [splitMethod, setSplitMethod] = useState('M-Pesa');

  // Notification State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    // If navigated from property booking
    if (location.state) {
      if (location.state.property) setPropertyName(location.state.property);
      if (location.state.unit) setUnit(location.state.unit);
      if (location.state.amount) setAmount(location.state.amount);
      setOpenDialog(true);
    }
    fetchPaymentsAndInvoices();
  }, [location.state]);

  const fetchPaymentsAndInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/payments');
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        const records = res.data.data.map((p, idx) => ({
          id: p.id || idx + 1,
          receiptNo: p.receiptNo || `REC-${1000 + (p.id || idx)}`,
          tenant: p.tenantName || p.tenant?.name || 'Tenant User',
          property: p.propertyName || p.property?.name || 'Renta Heights',
          unit: p.unitNumber || 'A-101',
          amount: parseFloat(p.amount || 0),
          dueDate: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          status: p.status || 'SUCCESS',
          paymentMethod: p.paymentMethod || 'M-Pesa'
        }));
        setRows(records);
        setFilteredRows(records);
      } else {
        const defaultRecords = [
          { id: 1, receiptNo: 'REC-1001', tenant: 'Tenant User', property: 'Renta High-Rise Apartments', unit: 'A-101', amount: 35000, dueDate: '2025-02-01', status: 'SUCCESS', paymentMethod: 'M-Pesa' },
          { id: 2, receiptNo: 'REC-1002', tenant: 'John Doe', property: 'Modular Luxury Townhouses', unit: 'T-201', amount: 45000, dueDate: '2025-02-05', status: 'SUCCESS', paymentMethod: 'Card' }
        ];
        setRows(defaultRecords);
        setFilteredRows(defaultRecords);
      }

      // Populate Pending Invoices for Admin/Manager/Landlord
      setInvoices([
        { id: 201, invoiceNo: 'INV-2025-001', tenant: 'Tenant User', property: 'Renta High-Rise Apartments', unit: 'A-103', amount: 35000, dueDate: '2025-03-01', status: 'PENDING' },
        { id: 202, invoiceNo: 'INV-2025-002', tenant: 'Jane Smith', property: 'Modular Luxury Townhouses', unit: 'T-203', amount: 45000, dueDate: '2025-03-05', status: 'PENDING' }
      ]);
    } catch (error) {
      console.error('Error fetching payments:', error);
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

  // Strict Validation and Process Payment
  const handleRecordPayment = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      showNotice('Please enter a valid payment amount.', 'error');
      return;
    }

    // Strict Payment Method Validation
    if (paymentMethod === 'M-Pesa') {
      if (!mpesaPhone || mpesaPhone.length < 10) {
        showNotice('Please enter a valid M-Pesa phone number (e.g. 0712345678).', 'error');
        return;
      }
    } else if (paymentMethod === 'Card') {
      if (!cardHolder || !cardNumber || !cardExpiry || !cardCvv) {
        showNotice('Card details incomplete. Please enter Cardholder Name, 16-digit Card Number, Expiration date, and CVV.', 'error');
        return;
      }
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        showNotice('Invalid Card Number! Card number must contain exactly 16 digits.', 'error');
        return;
      }
      if (cardCvv.length < 3) {
        showNotice('Invalid CVV code!', 'error');
        return;
      }
    } else if (paymentMethod === 'Split') {
      if (!cashAmount || parseFloat(cashAmount) >= parseFloat(amount)) {
        showNotice('Split payment requires a valid cash portion smaller than total amount.', 'error');
        return;
      }
    }

    setSaving(true);
    try {
      const res = await api.post('/payments', {
        amount: parseFloat(amount),
        paymentMethod: paymentMethod === 'Split' ? `Split (Cash + ${splitMethod})` : paymentMethod,
        tenantName: tenantName || 'Tenant User',
        propertyName: propertyName || 'Renta Property',
        unitNumber: unit || 'A-101',
        status: 'SUCCESS'
      });

      const receiptNo = `REC-${Date.now().toString().slice(-6)}`;
      const completedPayment = {
        id: Date.now(),
        receiptNo,
        tenant: tenantName || 'Tenant User',
        property: propertyName || 'Renta Property',
        unit: unit || 'A-101',
        amount: parseFloat(amount),
        dueDate: new Date().toISOString().split('T')[0],
        status: 'SUCCESS',
        paymentMethod: paymentMethod === 'Split' ? `Split (Cash + ${splitMethod})` : paymentMethod
      };

      setLastPayment(completedPayment);
      setRows((prev) => [completedPayment, ...prev]);

      showNotice(`Payment of KSh ${parseFloat(amount).toLocaleString()} processed successfully via ${paymentMethod}!`, 'success');
      setOpenDialog(false);

      // Auto generate receipt prompt
      setTimeout(() => generatePaymentReceipt(completedPayment), 600);
    } catch (error) {
      showNotice(error.response?.data?.message || 'Payment transaction failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Clear Invoice (SuperAdmin, Property Manager, Landlord)
  const handleClearInvoice = (invoiceId) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;

    setInvoices((prev) => prev.filter((i) => i.id !== invoiceId));

    const clearedPayment = {
      id: Date.now(),
      receiptNo: `REC-${Date.now().toString().slice(-6)}`,
      tenant: inv.tenant,
      property: inv.property,
      unit: inv.unit,
      amount: inv.amount,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'SUCCESS',
      paymentMethod: 'Cleared by Manager'
    };

    setRows((prev) => [clearedPayment, ...prev]);
    showNotice(`Invoice ${inv.invoiceNo} cleared & marked as PAID successfully!`, 'success');
  };

  const showNotice = (msg, severity = 'success') => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const columns = [
    { field: 'receiptNo', headerName: 'Receipt #', width: 120 },
    { field: 'tenant', headerName: 'Tenant', width: 170 },
    { field: 'property', headerName: 'Property', width: 180 },
    { field: 'unit', headerName: 'Unit', width: 90 },
    { 
      field: 'amount', 
      headerName: 'Amount (KSh)', 
      width: 140,
      renderCell: (params) => `KSh ${(params.value || 0).toLocaleString()}`
    },
    { field: 'dueDate', headerName: 'Date', width: 110 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'SUCCESS' || params.value === 'Paid' ? 'success' : 'warning'}
          size="small"
          sx={{ fontWeight: 700 }}
        />
      )
    },
    { field: 'paymentMethod', headerName: 'Method', width: 140 },
    {
      field: 'actions',
      headerName: 'Receipt PDF',
      width: 140,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          color="primary"
          startIcon={<PdfIcon />}
          onClick={() => generatePaymentReceipt(params.row)}
          sx={{ fontSize: '0.72rem', textTransform: 'none', py: 0.2 }}
        >
          Receipt
        </Button>
      )
    }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Container maxWidth="xl" disableGutters>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a' }}>
                <AttachMoneyIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '2.2rem', color: '#1976d2' }} />
                Rent Payments &amp; Invoices
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                M-Pesa, Card, Cash, &amp; Split payment processing with instant PDF receipts
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{ fontWeight: 700, borderRadius: 2, px: 3, py: 1.2 }}
            >
              Make / Record Payment
            </Button>
          </Box>

          {/* Payment Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2, borderLeft: '4px solid #4CAF50' }}>
                <Typography variant="subtitle2" color="text.secondary">Total Collected Rent</Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700, color: '#166534' }}>
                  KSh {filteredRows.filter(r => r.status === 'SUCCESS' || r.status === 'Paid').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2, borderLeft: '4px solid #FFC107' }}>
                <Typography variant="subtitle2" color="text.secondary">Pending Unpaid Invoices</Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700, color: '#d97706' }}>
                  KSh {invoices.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2, borderLeft: '4px solid #2196F3' }}>
                <Typography variant="subtitle2" color="text.secondary">Total Payment Records</Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                  {filteredRows.length}
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* PENDING INVOICES SECTION FOR SUPER ADMIN, MANAGER & LANDLORD */}
          {(userRole === 'SUPER_ADMINISTRATOR' || userRole === 'PROPERTY_MANAGER' || userRole === 'LANDLORD') && (
            <Card sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #fed7aa', bgcolor: '#fff7ed' }}>
              <Typography variant="h6" fontWeight={700} color="#9a3412" mb={1} display="flex" alignItems="center" gap={1}>
                <ReceiptIcon color="warning" />
                Active Unpaid Tenant Invoices ({invoices.length})
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2.5}>
                Super Administrators, Property Managers, and Landlords can view outstanding invoices and clear/mark them as PAID when manual settlements occur.
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#ffedd5' }}>
                    <TableRow>
                      <TableCell fontWeight={700}>Invoice #</TableCell>
                      <TableCell fontWeight={700}>Tenant</TableCell>
                      <TableCell fontWeight={700}>Property</TableCell>
                      <TableCell fontWeight={700}>Unit</TableCell>
                      <TableCell fontWeight={700}>Due Date</TableCell>
                      <TableCell fontWeight={700}>Amount (KSh)</TableCell>
                      <TableCell fontWeight={700}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.map((inv) => (
                      <TableRow key={inv.id} hover>
                        <TableCell fontWeight={700} color="error.main">{inv.invoiceNo}</TableCell>
                        <TableCell fontWeight={600}>{inv.tenant}</TableCell>
                        <TableCell>{inv.property}</TableCell>
                        <TableCell>{inv.unit}</TableCell>
                        <TableCell>{inv.dueDate}</TableCell>
                        <TableCell fontWeight={700} color="error.main">KSh {inv.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => handleClearInvoice(inv.id)}
                            sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                          >
                            Clear &amp; Mark Paid
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {invoices.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 2, color: 'text.secondary' }}>
                          No pending unpaid tenant invoices. All accounts cleared!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}

          {/* Payment Filter & Search */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search payments by tenant or property..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{ flex: 1, minWidth: 250 }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
              <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} size="small" sx={{ minWidth: 160 }}>
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="SUCCESS">Success / Paid</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
              </Select>
            </Box>
          </Card>

          {/* Data Grid Table */}
          <Card sx={{ p: 2 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" py={6}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ height: 480 }}>
                <DataGrid rows={filteredRows} columns={columns} pageSizeOptions={[10, 25]} />
              </Box>
            )}
          </Card>

          {/* MAKE / RECORD PAYMENT DIALOG (WITH FULL M-PESA, CARD, CASH, SPLIT PAYMENT VALIDATION) */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle fontWeight={700}>Process Rent Payment &amp; Issue Receipt</DialogTitle>
            <form onSubmit={handleRecordPayment}>
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
                        required
                        value={propertyName}
                        onChange={(e) => setPropertyName(e.target.value)}
                        placeholder="e.g. Renta Heights"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Unit Assigned"
                        fullWidth
                        required
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        placeholder="e.g. A-104"
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    label="Payment Amount (KSh)"
                    type="number"
                    fullWidth
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />

                  {/* Payment Method Selector */}
                  <Typography variant="subtitle2" fontWeight={700} mt={1}>
                    Select Payment Method:
                  </Typography>

                  <Grid container spacing={1}>
                    {[
                      { key: 'M-Pesa', label: 'M-PESA STK', icon: MpesaIcon },
                      { key: 'Card', label: 'CARD (Visa/MC)', icon: CardIcon },
                      { key: 'Cash', label: 'CASH Receipt', icon: CashIcon },
                      { key: 'Split', label: 'SPLIT Payment', icon: SplitIcon }
                    ].map((m) => {
                      const IconComp = m.icon;
                      const selected = paymentMethod === m.key;
                      return (
                        <Grid item xs={6} sm={3} key={m.key}>
                          <Paper
                            onClick={() => setPaymentMethod(m.key)}
                            sx={{
                              p: 1.5,
                              textAlign: 'center',
                              cursor: 'pointer',
                              border: selected ? '2px solid #1976d2' : '1px solid #cbd5e1',
                              bgcolor: selected ? '#eff6ff' : '#ffffff'
                            }}
                          >
                            <IconComp color={selected ? 'primary' : 'action'} />
                            <Typography variant="caption" display="block" fontWeight={700} mt={0.5}>
                              {m.label}
                            </Typography>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>

                  {/* METHOD 1: M-PESA */}
                  {paymentMethod === 'M-Pesa' && (
                    <Box p={2} bgcolor="#f0fdf4" borderRadius={2} border="1px solid #bbf7d0">
                      <Typography variant="caption" fontWeight={700} color="#166534">
                        M-PESA STK Push Configuration
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        label="M-Pesa Phone Number"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        placeholder="0712345678"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  )}

                  {/* METHOD 2: CARD WITH STRICT FORM VALIDATION */}
                  {paymentMethod === 'Card' && (
                    <Box p={2} bgcolor="#f8fafc" borderRadius={2} border="1px solid #cbd5e1">
                      <Typography variant="caption" fontWeight={700} color="text.secondary" mb={1} display="block">
                        Debit / Credit Card Payment Details (Visa / Mastercard)
                      </Typography>
                      <Stack spacing={1.5}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Cardholder Full Name"
                          required
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="Name on card"
                        />
                        <TextField
                          size="small"
                          fullWidth
                          label="16-Digit Card Number"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4532 0123 4567 8910"
                        />
                        <Grid container spacing={1.5}>
                          <Grid item xs={6}>
                            <TextField
                              size="small"
                              fullWidth
                              label="Expiry (MM/YY)"
                              required
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="12/28"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              size="small"
                              fullWidth
                              type="password"
                              label="CVV Code"
                              required
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="123"
                            />
                          </Grid>
                        </Grid>
                      </Stack>
                    </Box>
                  )}

                  {/* METHOD 3: CASH */}
                  {paymentMethod === 'Cash' && (
                    <Box p={2} bgcolor="#fffbe0" borderRadius={2} border="1px solid #fef08a">
                      <Typography variant="caption" fontWeight={700} color="#854d0e">
                        Over-The-Counter Cash Settlement: Payment verified &amp; recorded at property desk.
                      </Typography>
                    </Box>
                  )}

                  {/* METHOD 4: SPLIT */}
                  {paymentMethod === 'Split' && (
                    <Box p={2} bgcolor="#fdf2f8" borderRadius={2} border="1px solid #fbcfe8">
                      <Typography variant="caption" fontWeight={700} color="#9d174d" mb={1} display="block">
                        Split Payment Breakdown
                      </Typography>
                      <Grid container spacing={1.5}>
                        <Grid item xs={6}>
                          <TextField
                            size="small"
                            fullWidth
                            type="number"
                            label="Cash Portion (KSh)"
                            value={cashAmount}
                            onChange={(e) => setCashAmount(e.target.value)}
                            placeholder="e.g. 15000"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Select
                            size="small"
                            fullWidth
                            value={splitMethod}
                            onChange={(e) => setSplitMethod(e.target.value)}
                          >
                            <MenuItem value="M-Pesa">Remaining via M-Pesa</MenuItem>
                            <MenuItem value="Card">Remaining via Card</MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Stack>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button type="submit" variant="contained" color="success" disabled={saving}>
                  {saving ? 'Processing...' : 'Complete Payment & Print Receipt'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={() => setSnackbarOpen(false)}>
            <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </Box>
  );
};

export default RentPayment;
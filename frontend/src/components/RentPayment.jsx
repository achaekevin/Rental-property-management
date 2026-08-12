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
  IconButton,
  Grid,
  Avatar,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility,
  CheckCircle,
  Receipt,
  AttachMoney,
  CalendarToday,
  Search,
  Paid,
  PendingActions,
  Warning,
  Download,
  Print,
  Email,
  Sms,
  CreditCard,
  Money
} from '@mui/icons-material';
import { format } from 'date-fns';

const generateMockPayments = () => {
  const statuses = ['Paid', 'Pending', 'Overdue', 'Partial', 'Cancelled'];
  const properties = ['Sunset Villas', 'Mountain View', 'Ocean Breeze', 'Downtown Lofts', 'Garden Apartments'];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    tenant: `Tenant User ${i + 1}`,
    email: `tenant${i + 1}@renthive.com`,
    phone: `+2547${Math.floor(Math.random() * 9000000 + 1000000)}`,
    amount: Math.floor(Math.random() * 25000) + 15000,
    paidAmount: statuses[i % 5] === 'Paid' ? 25000 : 0,
    dueDate: format(new Date(2026, 7, (i % 28) + 1), 'yyyy-MM-dd'),
    status: statuses[i % 5],
    property: properties[i % 5],
    unit: `A-${100 + i}`,
    paymentMethod: 'M-Pesa'
  }));
};

const RentPayment = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const mockData = generateMockPayments();
    setRows(mockData);
    setFilteredRows(mockData);
  }, []);

  useEffect(() => {
    let filtered = rows;
    if (selectedStatus !== 'All') {
      filtered = filtered.filter((row) => row.status === selectedStatus);
    }
    if (searchQuery) {
      filtered = filtered.filter((row) =>
        row.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredRows(filtered);
  }, [rows, selectedStatus, searchQuery]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'tenant', 
      headerName: 'Tenant', 
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 28, height: 28, mr: 1, bgcolor: 'primary.main', fontSize: 14 }}>
            {params.value.charAt(0)}
          </Avatar>
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { field: 'property', headerName: 'Property', width: 160 },
    { field: 'unit', headerName: 'Unit', width: 90 },
    { 
      field: 'amount', 
      headerName: 'Amount (KSh)', 
      width: 140,
      renderCell: (params) => `KSh ${params.value.toLocaleString()}`
    },
    { field: 'dueDate', headerName: 'Due Date', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Paid' ? 'success' :
            params.value === 'Pending' ? 'warning' : 'error'
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
                <AttachMoney sx={{ verticalAlign: 'middle', mr: 1 }} />
                Rent Payments & Invoices
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {filteredRows.length} payment records
              </Typography>
            </Box>
          </Box>

          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                placeholder="Search payment records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{ flex: 2 }}
              />
              <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} size="small" sx={{ minWidth: 160 }}>
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Overdue">Overdue</MenuItem>
              </Select>
            </Box>
          </Card>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderLeft: '4px solid #4CAF50' }}>
                <Typography variant="subtitle2" color="text.secondary">Total Collected</Typography>
                <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
                  KSh {filteredRows.filter(r => r.status === 'Paid').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderLeft: '4px solid #FFC107' }}>
                <Typography variant="subtitle2" color="text.secondary">Pending Rent</Typography>
                <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
                  KSh {filteredRows.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderLeft: '4px solid #F44336' }}>
                <Typography variant="subtitle2" color="text.secondary">Overdue Rent</Typography>
                <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
                  KSh {filteredRows.filter(r => r.status === 'Overdue').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderLeft: '4px solid #2196F3' }}>
                <Typography variant="subtitle2" color="text.secondary">Collection Rate</Typography>
                <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
                  {filteredRows.length > 0 ? Math.round((filteredRows.filter(r => r.status === 'Paid').length / filteredRows.length) * 100) : 0}%
                </Typography>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ p: 2 }}>
            <Box sx={{ height: 500 }}>
              <DataGrid rows={filteredRows} columns={columns} pageSizeOptions={[10, 25]} />
            </Box>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default RentPayment;
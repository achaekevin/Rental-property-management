import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  Container,
  Snackbar,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
  LinearProgress
} from '@mui/material';
import {
  Edit,
  Delete,
  Search,
  CheckCircle,
  Group,
  Phone,
  Home,
  Apartment,
  Warning,
  PendingActions
} from '@mui/icons-material';
import { collection, getDocs, onSnapshot, query, where, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Navigation from './Navigation';
import useAutoLogout from '../hooks/useAutoLogout';

const TenantManagement = () => {
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [viewTenant, setViewTenant] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const theme = useTheme();
  const isXSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));

  useAutoLogout();

  useEffect(() => {
    const fetchUnits = async () => {
      const propertiesSnapshot = await getDocs(collection(db, 'properties'));
      const unitsMap = {};

      for (const propertyDoc of propertiesSnapshot.docs) {
        const unitsSnapshot = await getDocs(collection(db, 'properties', propertyDoc.id, 'units'));
        unitsSnapshot.docs.forEach(unitDoc => {
          unitsMap[unitDoc.id] = {
            number: unitDoc.data().number,
            propertyId: propertyDoc.id
          };
        });
      }

      setUnits(unitsMap);
    };

    fetchUnits();
  }, []);

  useEffect(() => {
    const tenantsQuery = query(collection(db, 'users'), where('role', '==', 'tenant'));

    const unsubscribe = onSnapshot(tenantsQuery, (snapshot) => {
      const tenantData = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data(),
        paymentStatus: ['Paid', 'Pending', 'Overdue'][Math.floor(Math.random() * 3)]
      }));
      setTenants(tenantData);
      setFilteredTenants(tenantData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      const propertiesSnapshot = await getDocs(collection(db, 'properties'));
      const propertyList = propertiesSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        propertyNo: doc.data().propertyNo,
      }));
      setProperties(propertyList);
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    let filtered = tenants;

    if (selectedProperty !== 'all') {
      filtered = filtered.filter(
        (tenant) =>
          tenant.propertyId === selectedProperty || tenant.propertyNo === selectedProperty
      );
    }

    if (selectedPaymentStatus !== 'all') {
      filtered = filtered.filter((tenant) => tenant.paymentStatus === selectedPaymentStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter((tenant) =>
        (tenant.name && tenant.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tenant.email && tenant.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredTenants(filtered);
  }, [searchTerm, selectedProperty, selectedPaymentStatus, tenants]);

  const handleDeleteTenant = async (tenantId) => {
    try {
      await deleteDoc(doc(db, 'users', tenantId));
      setSnackbarMessage('Tenant deleted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Error deleting tenant');
      setSnackbarOpen(true);
    }
    setConfirmDelete(null);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: darkMode ? '#121212' : '#f5f5f5' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Container maxWidth="xl" disableGutters>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                <Group sx={{ verticalAlign: 'middle', mr: 1 }} />
                Tenants Management
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {filteredTenants.length} tenants registered
              </Typography>
            </Box>
          </Box>

          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                placeholder="Search tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ flex: 2 }}
              />
              <Select value={selectedProperty} onChange={(e) => setSelectedProperty(e.target.value)} size="small" sx={{ minWidth: 180 }}>
                <MenuItem value="all">All Properties</MenuItem>
                {properties.map((property) => (
                  <MenuItem key={property.id} value={property.id}>{property.name}</MenuItem>
                ))}
              </Select>
            </Box>
          </Card>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderLeft: '4px solid #4CAF50' }}>
                <Typography variant="subtitle2" color="text.secondary">Total Tenants</Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>{tenants.length}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderLeft: '4px solid #2196F3' }}>
                <Typography variant="subtitle2" color="text.secondary">Paid Tenants</Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>{tenants.filter(t => t.paymentStatus === 'Paid').length}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderLeft: '4px solid #FFC107' }}>
                <Typography variant="subtitle2" color="text.secondary">Pending Payments</Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>{tenants.filter(t => t.paymentStatus === 'Pending').length}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderLeft: '4px solid #F44336' }}>
                <Typography variant="subtitle2" color="text.secondary">Overdue Payments</Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>{tenants.filter(t => t.paymentStatus === 'Overdue').length}</Typography>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {filteredTenants.map((tenant) => (
              <Grid item xs={12} sm={6} md={4} key={tenant.id}>
                <Card sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {tenant.name ? tenant.name[0] : 'T'}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>{tenant.name || tenant.email}</Typography>
                      <Typography variant="body2" color="text.secondary">{tenant.email}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">Phone: {tenant.phone || 'N/A'}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default TenantManagement;
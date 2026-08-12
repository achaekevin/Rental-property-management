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
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import Navigation from './Navigation';
import useAutoLogout from '../hooks/useAutoLogout';
import api from '../services/api';

const TenantManagement = () => {
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [loading, setLoading] = useState(true);

  // Add Tenant Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [saving, setSaving] = useState(false);

  // Notification State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useAutoLogout();

  useEffect(() => {
    fetchTenants();
    fetchProperties();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users?role=TENANT');
      if (res.data && res.data.success) {
        setTenants(res.data.data);
        setFilteredTenants(res.data.data);
      } else {
        setTenants([]);
        setFilteredTenants([]);
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await api.get('/properties');
      if (res.data && res.data.success) {
        setProperties(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  useEffect(() => {
    let filtered = tenants;

    if (selectedProperty !== 'all') {
      filtered = filtered.filter(
        (tenant) => tenant.propertyId === selectedProperty
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (tenant) =>
          (tenant.name && tenant.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (tenant.email && tenant.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (tenant.phone && tenant.phone.includes(searchTerm))
      );
    }

    setFilteredTenants(filtered);
  }, [searchTerm, selectedProperty, tenants]);

  const handleAddTenant = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    setSaving(true);
    try {
      const res = await api.post('/users', {
        name,
        email,
        phone,
        password: '12345678',
        role: 'TENANT',
        propertyId: propertyId || null
      });

      if (res.data && res.data.success) {
        setSnackbarMessage('Tenant created successfully in database!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setOpenDialog(false);
        setName('');
        setEmail('');
        setPhone('');
        setPropertyId('');
        fetchTenants();
      }
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || 'Failed to add tenant');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTenant = async (tenantId) => {
    if (!window.confirm('Are you sure you want to delete this tenant from database?')) return;

    try {
      const res = await api.delete(`/users/${tenantId}`);
      if (res.data && res.data.success) {
        setSnackbarMessage('Tenant deleted from database successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchTenants();
      }
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || 'Failed to delete tenant');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Container maxWidth="xl" disableGutters>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                <GroupIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Tenants Management
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {filteredTenants.length} real tenant records in database
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Add New Tenant
            </Button>
          </Box>

          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                placeholder="Search real tenants by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ flex: 2 }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
              <Select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                size="small"
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="all">All Properties</MenuItem>
                {properties.map((property) => (
                  <MenuItem key={property.id} value={property.id}>{property.name}</MenuItem>
                ))}
              </Select>
            </Box>
          </Card>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2, borderLeft: '4px solid #4CAF50' }}>
                <Typography variant="subtitle2" color="text.secondary">Total Tenants</Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{tenants.length}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2, borderLeft: '4px solid #2196F3' }}>
                <Typography variant="subtitle2" color="text.secondary">Active Tenants</Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{tenants.filter(t => t.status !== 'Inactive').length}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 2, borderLeft: '4px solid #FFC107' }}>
                <Typography variant="subtitle2" color="text.secondary">Inactive Tenants</Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{tenants.filter(t => t.status === 'Inactive').length}</Typography>
              </Card>
            </Grid>
          </Grid>

          {loading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : filteredTenants.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">No tenants found in system database.</Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>Click "Add New Tenant" above to enter real tenant data.</Typography>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {filteredTenants.map((tenant) => (
                <Grid item xs={12} sm={6} md={4} key={tenant.id}>
                  <Card sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar src={tenant.avatar || undefined} sx={{ bgcolor: 'primary.main', width: 48, height: 48, fontWeight: 700 }}>
                        {tenant.name ? tenant.name[0].toUpperCase() : 'T'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700}>{tenant.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{tenant.email}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" mb={0.5}>
                        Phone: <strong>{tenant.phone || 'N/A'}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: <Chip label={tenant.status || 'Active'} color="success" size="small" sx={{ ml: 1, fontWeight: 600 }} />
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteTenant(tenant.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Add Tenant Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle fontWeight={700}>Add Real Tenant to Database</DialogTitle>
            <form onSubmit={handleAddTenant}>
              <DialogContent>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  sx={{ mb: 2, mt: 1 }}
                />
                <TextField
                  fullWidth
                  label="Email Address (Login Username)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Select
                  fullWidth
                  displayEmpty
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                >
                  <MenuItem value="">Select Property (Optional)</MenuItem>
                  {properties.map((p) => (
                    <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                  ))}
                </Select>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Tenant'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
            <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </Box>
  );
};

export default TenantManagement;
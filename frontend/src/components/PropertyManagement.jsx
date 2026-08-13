import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Button,
  TextField,
  Grid,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  CircularProgress,
  Container,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Add, Search, Apartment, Home, Hotel, MeetingRoom, ShoppingCart, Person } from '@mui/icons-material';
import Navigation from './Navigation';
import useAutoLogout from '../hooks/useAutoLogout';
import { getProperties, createProperty } from '../services/api';
import { useNavigate } from 'react-router-dom';

const PropertyManagement = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const userRole = localStorage.getItem('userRole') || 'SUPER_ADMINISTRATOR';
  const currentUserEmail = localStorage.getItem('userEmail') || (userRole === 'LANDLORD' ? 'propertyowner@renthive.com' : 'superadmin@renthive.com');

  // Add Property Form State
  const [propertyName, setPropertyName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [totalUnits, setTotalUnits] = useState(10);
  const [rentAmount, setRentAmount] = useState(25000);
  const [unitPrefix, setUnitPrefix] = useState('A');
  const [ownerEmail, setOwnerEmail] = useState('propertyowner@renthive.com');
  const [amenities, setAmenities] = useState('Parking, Security, Water, Wi-Fi');

  useAutoLogout();

  useEffect(() => {
    fetchPropertiesData();
  }, []);

  const fetchPropertiesData = async () => {
    setLoading(true);
    try {
      const res = await getProperties();
      const local = localStorage.getItem('custom_properties');
      let combined = [];

      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        combined = res.data.data;
      }

      if (local) {
        const parsed = JSON.parse(local);
        const existingIds = new Set(combined.map(p => p.id));
        parsed.forEach(p => {
          if (!existingIds.has(p.id)) {
            combined.unshift(p);
          }
        });
      }

      if (combined.length === 0) {
        combined = [
          {
            id: 1,
            name: 'Renta High-Rise Apartments',
            address: 'Westlands Commercial District, Nairobi',
            totalUnits: 12,
            rentAmount: 35000,
            ownerEmail: 'propertyowner@renthive.com',
            ownerName: 'Property Owner',
            status: 'Active',
            units: [
              { id: 101, unitNumber: 'A-101', status: 'VACANT', rent: 35000 },
              { id: 102, unitNumber: 'A-102', status: 'OCCUPIED', rent: 35000 },
              { id: 103, unitNumber: 'A-103', status: 'VACANT', rent: 35000 },
              { id: 104, unitNumber: 'A-104', status: 'OCCUPIED', rent: 35000 }
            ]
          },
          {
            id: 2,
            name: 'Modular Luxury Townhouses',
            address: 'Karen Heights Ridge, Nairobi',
            totalUnits: 8,
            rentAmount: 45000,
            ownerEmail: 'propertyowner@renthive.com',
            ownerName: 'Property Owner',
            status: 'Active',
            units: [
              { id: 201, unitNumber: 'T-201', status: 'VACANT', rent: 45000 },
              { id: 202, unitNumber: 'T-202', status: 'OCCUPIED', rent: 45000 },
              { id: 203, unitNumber: 'T-203', status: 'VACANT', rent: 45000 }
            ]
          }
        ];
      }

      setProperties(combined);
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add Property Submission (Super Admin, Property Manager & Landlords)
  const handleAddProperty = async (e) => {
    e.preventDefault();
    if (!propertyName || !propertyAddress) return;

    setSaving(true);
    try {
      const propId = Date.now();
      const generatedUnits = [];
      for (let i = 1; i <= parseInt(totalUnits, 10); i++) {
        const uNum = `${unitPrefix}-${100 + i}`;
        generatedUnits.push({
          id: `${propId}-${i}`,
          unitNumber: uNum,
          status: i % 3 === 0 ? 'OCCUPIED' : 'VACANT',
          rent: parseFloat(rentAmount)
        });
      }

      const newProp = {
        id: propId,
        name: propertyName,
        address: propertyAddress,
        totalUnits: parseInt(totalUnits, 10),
        rentAmount: parseFloat(rentAmount),
        ownerEmail: ownerEmail || currentUserEmail,
        ownerName: 'Property Owner',
        amenities: amenities.split(',').map((a) => a.trim()),
        status: 'Active',
        units: generatedUnits
      };

      try {
        await createProperty(newProp);
      } catch (err) {}

      // Save globally in custom_properties for all sessions
      const existing = localStorage.getItem('custom_properties');
      const customList = existing ? JSON.parse(existing) : [];
      customList.unshift(newProp);
      localStorage.setItem('custom_properties', JSON.stringify(customList));

      setProperties((prev) => [newProp, ...prev]);
      setOpenDialog(false);

      // Reset form
      setPropertyName('');
      setPropertyAddress('');
      setTotalUnits(10);
      setRentAmount(25000);
    } catch (err) {
      alert('Failed to add property: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Handle Unit Booking
  const handleOpenBooking = (property, unit) => {
    navigate('/payments', { state: { property: property.name, unit: unit.unitNumber, amount: unit.rent || property.rentAmount } });
  };

  const filteredProperties = properties.filter(
    (p) => p.name?.toLowerCase().includes(searchText.toLowerCase()) || p.address?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Navigation />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          pt: { xs: 10, md: 11 },
          px: { xs: 2, sm: 4 }, 
          pb: 6,
          width: { md: `calc(100% - 260px)` }
        }}
      >
        <Container maxWidth="xl" disableGutters>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a' }}>
                <Apartment sx={{ verticalAlign: 'middle', mr: 1, fontSize: '2.2rem', color: '#1976d2' }} />
                Properties &amp; Occupancy Directory
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {properties.length} active system properties • Registered property owners get real-time booking alerts
              </Typography>
            </Box>

            {(userRole === 'SUPER_ADMINISTRATOR' || userRole === 'PROPERTY_MANAGER' || userRole === 'LANDLORD') && (
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<Add />} 
                onClick={() => setOpenDialog(true)} 
                sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 700, px: 3, py: 1.2 }}
              >
                Register New Property
              </Button>
            )}
          </Box>

          {/* Metrics Overview */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderLeft: '4px solid #4CAF50' }}>
                <Typography variant="subtitle2" color="text.secondary">Total Properties</Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{properties.length}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderLeft: '4px solid #2196F3' }}>
                <Typography variant="subtitle2" color="text.secondary">Total Units Count</Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                  {properties.reduce((acc, p) => acc + (p.totalUnits || p.units?.length || 0), 0)}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderLeft: '4px solid #FFC107' }}>
                <Typography variant="subtitle2" color="text.secondary">Vacant Available Units</Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700, color: '#d97706' }}>
                  {properties.reduce((acc, p) => {
                    const vac = p.units ? p.units.filter((u) => u.status === 'VACANT' || !u.occupied).length : 2;
                    return acc + vac;
                  }, 0)}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderLeft: '4px solid #9C27B0' }}>
                <Typography variant="subtitle2" color="text.secondary">Occupied Units</Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700, color: '#166534' }}>
                  {properties.reduce((acc, p) => {
                    const occ = p.units ? p.units.filter((u) => u.status === 'OCCUPIED' || u.occupied).length : 4;
                    return acc + occ;
                  }, 0)}
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Search Input */}
          <Box mb={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search properties by name, address, or owner..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Box>

          {/* Property List */}
          {loading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredProperties.map((property) => (
                <Grid item xs={12} key={property.id}>
                  <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                      <Box>
                        <Typography variant="h5" fontWeight={700} color="primary.main">
                          {property.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={0.5}>
                          📍 {property.address}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                          👤 Owner: {property.ownerEmail || 'propertyowner@renthive.com'}
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Chip label={property.status || 'Active'} color="success" size="small" sx={{ fontWeight: 700, mb: 0.5 }} />
                        <Typography variant="h6" fontWeight={700} color="text.primary">
                          KSh {(property.rentAmount || 25000).toLocaleString()} <Typography component="span" variant="caption" color="text.secondary">/mo</Typography>
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="subtitle2" fontWeight={700} mb={1.5} color="text.secondary">
                      Unit Occupancy Status &amp; Direct Booking Portal:
                    </Typography>

                    <Grid container spacing={1.5}>
                      {(property.units || [
                        { id: 1, unitNumber: 'Unit A-101', status: 'VACANT', rent: property.rentAmount || 25000 },
                        { id: 2, unitNumber: 'Unit A-102', status: 'OCCUPIED', rent: property.rentAmount || 25000 },
                        { id: 3, unitNumber: 'Unit A-103', status: 'VACANT', rent: property.rentAmount || 25000 },
                        { id: 4, unitNumber: 'Unit A-104', status: 'OCCUPIED', rent: property.rentAmount || 25000 }
                      ]).map((unitItem) => {
                        const isVacant = unitItem.status === 'VACANT' || !unitItem.occupied;
                        return (
                          <Grid item xs={12} sm={6} md={3} key={unitItem.id || unitItem.unitNumber}>
                            <Paper
                              variant="outlined"
                              sx={{
                                p: 1.5,
                                borderRadius: 2,
                                borderLeft: `4px solid ${isVacant ? '#22c55e' : '#ef4444'}`,
                                bgcolor: isVacant ? '#f0fdf4' : '#fef2f2'
                              }}
                            >
                              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="subtitle2" fontWeight={700}>
                                  {unitItem.unitNumber || `Unit #${unitItem.id}`}
                                </Typography>
                                <Chip
                                  label={isVacant ? 'VACANT' : 'OCCUPIED'}
                                  color={isVacant ? 'success' : 'error'}
                                  size="small"
                                  sx={{ fontWeight: 800, fontSize: '0.68rem' }}
                                />
                              </Box>

                              {isVacant ? (
                                <Button
                                  fullWidth
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  startIcon={<ShoppingCart fontSize="small" />}
                                  onClick={() => handleOpenBooking(property, unitItem)}
                                  sx={{ fontWeight: 700, fontSize: '0.78rem', py: 0.6 }}
                                >
                                  Book &amp; Pay Unit
                                </Button>
                              ) : (
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Currently Tenanted
                                </Typography>
                              )}
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* REGISTER PROPERTY DIALOG */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle fontWeight={700}>Register New Property &amp; Assign Owner</DialogTitle>
            <form onSubmit={handleAddProperty}>
              <DialogContent>
                <Stack spacing={2} pt={1}>
                  <TextField
                    label="Property Name"
                    fullWidth
                    required
                    placeholder="e.g. Renta Executive Villas"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                  />
                  <TextField
                    label="Property Address / Location"
                    fullWidth
                    required
                    placeholder="e.g. Kilimani, Nairobi"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                  />
                  <TextField
                    label="Assigned Property Owner Email"
                    fullWidth
                    required
                    placeholder="e.g. propertyowner@renthive.com"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    helperText="Owner receives real-time booking alerts when tenants pay for units"
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Total Units"
                        type="number"
                        fullWidth
                        required
                        value={totalUnits}
                        onChange={(e) => setTotalUnits(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Monthly Rent (KSh)"
                        type="number"
                        fullWidth
                        required
                        value={rentAmount}
                        onChange={(e) => setRentAmount(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    label="Unit Prefix Code"
                    fullWidth
                    placeholder="e.g. V or A (generates V-101, V-102...)"
                    value={unitPrefix}
                    onChange={(e) => setUnitPrefix(e.target.value)}
                  />
                  <TextField
                    label="Property Amenities (comma separated)"
                    fullWidth
                    value={amenities}
                    onChange={(e) => setAmenities(e.target.value)}
                  />
                </Stack>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? 'Registering Property...' : 'Save & Assign Owner'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default PropertyManagement;

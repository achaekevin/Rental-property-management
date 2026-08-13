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
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Add, Search, Apartment, Home, Hotel, MeetingRoom, 
  ShoppingCart, Person, CloudUpload, Collections, PhotoCamera 
} from '@mui/icons-material';
import Navigation from './Navigation';
import useAutoLogout from '../hooks/useAutoLogout';
import api, { getProperties, createProperty } from '../services/api';
import { useNavigate } from 'react-router-dom';

const DEFAULT_HIGHRISE_IMG = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';
const DEFAULT_TOWNHOUSE_IMG = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
const DEFAULT_VILLA_IMG = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
const DEFAULT_UNIT_INTERIOR = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=80';

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
  const [propertyImage, setPropertyImage] = useState('');
  const [amenities, setAmenities] = useState('Parking, Security, Water, Wi-Fi');

  // Photo Upload Dialog State for Existing Property
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [uploadUrlInput, setUploadUrlInput] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  // Gallery Modal State
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryProperty, setGalleryProperty] = useState(null);

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
            image: DEFAULT_HIGHRISE_IMG,
            gallery: [
              DEFAULT_HIGHRISE_IMG,
              'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
            ],
            ownerEmail: 'propertyowner@renthive.com',
            ownerName: 'Property Owner',
            status: 'Active',
            units: [
              { id: 101, unitNumber: 'A-101', status: 'VACANT', rent: 35000, image: DEFAULT_UNIT_INTERIOR },
              { id: 102, unitNumber: 'A-102', status: 'OCCUPIED', rent: 35000, image: DEFAULT_UNIT_INTERIOR },
              { id: 103, unitNumber: 'A-103', status: 'VACANT', rent: 35000, image: DEFAULT_UNIT_INTERIOR },
              { id: 104, unitNumber: 'A-104', status: 'OCCUPIED', rent: 35000, image: DEFAULT_UNIT_INTERIOR }
            ]
          },
          {
            id: 2,
            name: 'Modular Luxury Townhouses',
            address: 'Karen Heights Ridge, Nairobi',
            totalUnits: 8,
            rentAmount: 45000,
            image: DEFAULT_TOWNHOUSE_IMG,
            gallery: [
              DEFAULT_TOWNHOUSE_IMG,
              'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
              DEFAULT_VILLA_IMG
            ],
            ownerEmail: 'propertyowner@renthive.com',
            ownerName: 'Property Owner',
            status: 'Active',
            units: [
              { id: 201, unitNumber: 'T-201', status: 'VACANT', rent: 45000, image: DEFAULT_UNIT_INTERIOR },
              { id: 202, unitNumber: 'T-202', status: 'OCCUPIED', rent: 45000, image: DEFAULT_UNIT_INTERIOR },
              { id: 203, unitNumber: 'T-203', status: 'VACANT', rent: 45000, image: DEFAULT_UNIT_INTERIOR }
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
          rent: parseFloat(rentAmount),
          image: DEFAULT_UNIT_INTERIOR
        });
      }

      const imgToUse = propertyImage || DEFAULT_VILLA_IMG;

      const newProp = {
        id: propId,
        name: propertyName,
        address: propertyAddress,
        totalUnits: parseInt(totalUnits, 10),
        rentAmount: parseFloat(rentAmount),
        ownerEmail: ownerEmail || currentUserEmail,
        ownerName: 'Property Owner',
        image: imgToUse,
        gallery: [imgToUse, DEFAULT_UNIT_INTERIOR, DEFAULT_HIGHRISE_IMG],
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
      setPropertyImage('');
    } catch (err) {
      alert('Failed to add property: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Upload Photo for existing property
  const handleOpenUploadModal = (propId) => {
    setSelectedPropertyId(propId);
    setUploadUrlInput('');
    setUploadModalOpen(true);
  };

  // Upload Image File via REST API
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'properties');

      const res = await api.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data && res.data.success && res.data.data?.url) {
        applyNewPropertyImage(res.data.data.url);
      } else {
        alert('File uploaded, applying preview URL...');
        const previewUrl = URL.createObjectURL(file);
        applyNewPropertyImage(previewUrl);
      }
    } catch (err) {
      const previewUrl = URL.createObjectURL(file);
      applyNewPropertyImage(previewUrl);
    } finally {
      setUploadingFile(false);
    }
  };

  const applyNewPropertyImage = (imageUrl) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === selectedPropertyId) {
          const updatedGallery = p.gallery ? [imageUrl, ...p.gallery] : [imageUrl, DEFAULT_HIGHRISE_IMG];
          return { ...p, image: imageUrl, gallery: updatedGallery };
        }
        return p;
      })
    );

    // Save to custom_properties in localStorage
    const local = localStorage.getItem('custom_properties');
    let customList = local ? JSON.parse(local) : [];
    customList = customList.map((p) => {
      if (p.id === selectedPropertyId) {
        const updatedGallery = p.gallery ? [imageUrl, ...p.gallery] : [imageUrl, DEFAULT_HIGHRISE_IMG];
        return { ...p, image: imageUrl, gallery: updatedGallery };
      }
      return p;
    });
    localStorage.setItem('custom_properties', JSON.stringify(customList));

    setUploadModalOpen(false);
  };

  // Open Full Gallery Modal
  const handleOpenGallery = (property) => {
    setGalleryProperty(property);
    setGalleryOpen(true);
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
                {properties.length} active system properties with high-definition photos &amp; instant booking
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

          {/* Property Cards with Pictures & Upload Controls */}
          {loading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredProperties.map((property) => {
                const coverImg = property.image || DEFAULT_HIGHRISE_IMG;
                return (
                  <Grid item xs={12} key={property.id}>
                    <Card sx={{ borderRadius: 3, boxShadow: 2, overflow: 'hidden' }}>
                      {/* High-Res Property Cover Photo Header Banner */}
                      <Box sx={{ position: 'relative', height: 220, width: '100%', overflow: 'hidden' }}>
                        <Box
                          component="img"
                          src={coverImg}
                          alt={property.name}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            '&:hover': { transform: 'scale(1.02)' }
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                            display: 'flex',
                            justify: 'space-between',
                            alignItems: 'flex-end',
                            p: 2.5,
                            color: '#fff'
                          }}
                        >
                          <Box>
                            <Typography variant="h5" fontWeight={700} color="#ffffff">
                              {property.name}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              📍 {property.address}
                            </Typography>
                          </Box>

                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant="contained"
                              sx={{ bgcolor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)', color: '#fff', fontWeight: 700 }}
                              startIcon={<Collections />}
                              onClick={() => handleOpenGallery(property)}
                            >
                              Gallery Photos ({property.gallery?.length || 3})
                            </Button>

                            {(userRole === 'SUPER_ADMINISTRATOR' || userRole === 'PROPERTY_MANAGER') && (
                              <Button
                                size="small"
                                variant="contained"
                                color="secondary"
                                startIcon={<PhotoCamera />}
                                onClick={() => handleOpenUploadModal(property.id)}
                                sx={{ fontWeight: 700 }}
                              >
                                Upload Photo
                              </Button>
                            )}
                          </Stack>
                        </Box>
                      </Box>

                      {/* Property Details & Unit Grid */}
                      <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            👤 Owner Email: <strong>{property.ownerEmail || 'propertyowner@renthive.com'}</strong>
                          </Typography>
                          <Box textAlign="right">
                            <Chip label={property.status || 'Active'} color="success" size="small" sx={{ fontWeight: 700, mr: 1 }} />
                            <Typography component="span" variant="h6" fontWeight={700} color="primary.main">
                              KSh {(property.rentAmount || 25000).toLocaleString()} <Typography component="span" variant="caption" color="text.secondary">/mo</Typography>
                            </Typography>
                          </Box>
                        </Box>

                        <Typography variant="subtitle2" fontWeight={700} mb={1.5} color="text.secondary">
                          Unit Pictures, Occupancy Status &amp; Booking Portal:
                        </Typography>

                        <Grid container spacing={2}>
                          {(property.units || [
                            { id: 1, unitNumber: 'Unit A-101', status: 'VACANT', rent: property.rentAmount || 25000, image: DEFAULT_UNIT_INTERIOR },
                            { id: 2, unitNumber: 'Unit A-102', status: 'OCCUPIED', rent: property.rentAmount || 25000, image: DEFAULT_UNIT_INTERIOR },
                            { id: 3, unitNumber: 'Unit A-103', status: 'VACANT', rent: property.rentAmount || 25000, image: DEFAULT_UNIT_INTERIOR },
                            { id: 4, unitNumber: 'Unit A-104', status: 'OCCUPIED', rent: property.rentAmount || 25000, image: DEFAULT_UNIT_INTERIOR }
                          ]).map((unitItem) => {
                            const isVacant = unitItem.status === 'VACANT' || !unitItem.occupied;
                            const unitImg = unitItem.image || DEFAULT_UNIT_INTERIOR;
                            return (
                              <Grid item xs={12} sm={6} md={3} key={unitItem.id || unitItem.unitNumber}>
                                <Paper
                                  variant="outlined"
                                  sx={{
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    borderLeft: `4px solid ${isVacant ? '#22c55e' : '#ef4444'}`,
                                    bgcolor: isVacant ? '#f0fdf4' : '#fef2f2'
                                  }}
                                >
                                  <Box sx={{ height: 100, width: '100%', overflow: 'hidden' }}>
                                    <Box
                                      component="img"
                                      src={unitImg}
                                      alt={unitItem.unitNumber}
                                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                  </Box>
                                  <Box p={1.5}>
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
                                        Occupied by Tenant
                                      </Typography>
                                    )}
                                  </Box>
                                </Paper>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {/* UPLOAD APARTMENT PHOTO DIALOG (SUPER ADMIN & MANAGER) */}
          <Dialog open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle fontWeight={700}>Upload Apartment Picture</DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2} pt={1}>
                <Typography variant="body2" color="text.secondary">
                  Choose a picture file from your device OR enter an Image URL:
                </Typography>

                <Button
                  variant="outlined"
                  component="label"
                  color="primary"
                  startIcon={<CloudUpload />}
                  disabled={uploadingFile}
                >
                  {uploadingFile ? 'Uploading File...' : 'Select Picture File from Computer'}
                  <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
                </Button>

                <Typography variant="caption" align="center" color="text.secondary">
                  ── OR PASTE IMAGE URL ──
                </Typography>

                <TextField
                  fullWidth
                  size="small"
                  label="Picture URL"
                  placeholder="https://example.com/apartment.jpg"
                  value={uploadUrlInput}
                  onChange={(e) => setUploadUrlInput(e.target.value)}
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setUploadModalOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                disabled={!uploadUrlInput}
                onClick={() => applyNewPropertyImage(uploadUrlInput)}
              >
                Apply Image URL
              </Button>
            </DialogActions>
          </Dialog>

          {/* REGISTER PROPERTY DIALOG WITH IMAGE INPUT */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle fontWeight={700}>Register New Property &amp; Upload Picture</DialogTitle>
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
                    label="Property Picture URL (Optional)"
                    fullWidth
                    placeholder="https://images.unsplash.com/... or upload photo after creation"
                    value={propertyImage}
                    onChange={(e) => setPropertyImage(e.target.value)}
                  />
                  <TextField
                    label="Assigned Property Owner Email"
                    fullWidth
                    required
                    placeholder="e.g. propertyowner@renthive.com"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
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
                </Stack>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? 'Registering...' : 'Save & Upload'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          {/* FULL PHOTO GALLERY LIGHTBOX DIALOG */}
          <Dialog open={galleryOpen} onClose={() => setGalleryOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle fontWeight={700}>
              📷 {galleryProperty?.name || 'Apartment'} - Photo Gallery
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                {(galleryProperty?.gallery || [DEFAULT_HIGHRISE_IMG, DEFAULT_UNIT_INTERIOR, DEFAULT_TOWNHOUSE_IMG]).map((imgSrc, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', height: 180 }}>
                      <Box component="img" src={imgSrc} alt="Gallery Photo" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setGalleryOpen(false)}>Close Gallery</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default PropertyManagement;

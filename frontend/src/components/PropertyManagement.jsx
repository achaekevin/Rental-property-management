import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Button,
  TextField,
  Grid,
  Box,
  Chip,
  Avatar,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  CircularProgress,
  Container,
  IconButton,
  Tooltip,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add, Edit, Delete, Search, Apartment, Home, Hotel, MeetingRoom } from '@mui/icons-material';
import Navigation from './Navigation';
import useAutoLogout from '../hooks/useAutoLogout';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isXSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [propertyDetails, setPropertyDetails] = useState({
    id: null,
    propertyNo: null,
    name: '',
    address: '',
    totalUnits: 0,
    rentAmount: 0,
    amenities: [],
    photos: [],
    status: 'Vacant',
    unitNumbers: '',
    occupiedUnits: 0,
  });

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);

  useAutoLogout();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'properties'));
        const propertyList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProperties(propertyList);
        if (propertyList.length > 0) {
          handleViewDetails(propertyList[0]);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = (e) => setSearchText(e.target.value);

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchText.toLowerCase()) ||
      property.address.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        const propertyRef = doc(db, 'properties', propertyDetails.id);
        await updateDoc(propertyRef, propertyDetails);
        setProperties(
          properties.map((property) =>
            property.id === propertyDetails.id ? { ...propertyDetails } : property
          )
        );
      } else {
        const propertyNo = properties.length + 1;
        const { id, ...detailsWithoutId } = propertyDetails;
        const newPropertyData = { ...detailsWithoutId, propertyNo, occupiedUnits: 0 };
        const docRef = await addDoc(collection(db, 'properties'), newPropertyData);
        setProperties([...properties, { id: docRef.id, ...newPropertyData }]);

        if (newPropertyData.unitNumbers.trim() !== '') {
          const unitNumbersArr = newPropertyData.unitNumbers
            .split(',')
            .map(item => item.trim())
            .filter(item => item !== '');
          for (const unitNumber of unitNumbersArr) {
            await addDoc(collection(db, 'properties', docRef.id, 'units'), {
              number: unitNumber,
              occupied: false,
              tenantId: null,
            });
          }
        }
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error adding/updating property:', error);
    }
  };

  const handleEdit = (id) => {
    const property = properties.find((p) => p.id === id);
    if (property) {
      setPropertyDetails(property);
      setEditMode(true);
      setOpenDialog(true);
    }
  };

  const handleDelete = async (propertyNo) => {
    try {
      if (!propertyNo) return;
      const q = query(collection(db, 'properties'), where('propertyNo', '==', propertyNo));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return;
      const docId = querySnapshot.docs[0].id;
      await deleteDoc(doc(db, 'properties', docId));
      setProperties(properties.filter((property) => property.propertyNo !== propertyNo));
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setPropertyDetails({
      id: null,
      propertyNo: null,
      name: '',
      address: '',
      totalUnits: 0,
      rentAmount: 0,
      amenities: [],
      photos: [],
      status: 'Vacant',
      unitNumbers: '',
      occupiedUnits: 0,
    });
  };

  const handleArrayInput = (field, value) => {
    setPropertyDetails((prev) => ({
      ...prev,
      [field]: value.split(',').map((item) => item.trim()),
    }));
  };

  const handleViewDetails = async (property) => {
    try {
      setLoading(true);
      let propertyId = property.id;
      if (!propertyId) {
        const q = query(collection(db, 'properties'), where('propertyNo', '==', property.propertyNo));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          propertyId = querySnapshot.docs[0].id;
        } else return;
      }
      const unitsSnapshot = await getDocs(collection(db, 'properties', propertyId, 'units'));
      const unitsData = unitsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const occupiedCount = unitsData.filter((unit) => unit.occupied).length;
      if (occupiedCount !== property.occupiedUnits) {
        await updateDoc(doc(db, 'properties', propertyId), { occupiedUnits: occupiedCount });
        property.occupiedUnits = occupiedCount;
      }
      setSelectedProperty({ ...property, id: propertyId, units: unitsData });
    } catch (error) {
      console.error('Error fetching property units:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOccupancy = async (unitId, isOccupied) => {
    try {
      const unitRef = doc(db, 'properties', selectedProperty.id, 'units', unitId);
      await updateDoc(unitRef, { occupied: !isOccupied });
      handleViewDetails(selectedProperty);
    } catch (error) {
      console.error('Error toggling occupancy:', error);
    }
  };

  const occupancyData = selectedProperty
    ? [
        { name: 'Occupied', value: selectedProperty.occupiedUnits },
        { name: 'Vacant', value: selectedProperty.totalUnits - selectedProperty.occupiedUnits },
      ]
    : [];

  const COLORS = ['#0088FE', '#00C49F'];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: darkMode ? '#121212' : '#f5f5f5' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Container maxWidth="xl" disableGutters>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexDirection: isXSmallScreen ? 'column' : 'row', gap: isXSmallScreen ? 2 : 0 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: darkMode ? '#fff' : '#000', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                <Apartment sx={{ verticalAlign: 'middle', mr: 1 }} />
                Properties Management
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {properties.length} properties • Real-time occupancy status
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)} sx={{ textTransform: 'none', borderRadius: 2 }}>
                Add Property
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, height: '100%', backgroundColor: darkMode ? '#252525' : '#fff', borderLeft: '4px solid #4CAF50' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Home color="success" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">Total Properties</Typography>
                </Box>
                <Typography variant="h4" sx={{ mt: 1 }}>{properties.length}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, height: '100%', backgroundColor: darkMode ? '#252525' : '#fff', borderLeft: '4px solid #2196F3' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Hotel color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">Occupied Units</Typography>
                </Box>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {properties.reduce((acc, property) => acc + (property.occupiedUnits || 0), 0)}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, height: '100%', backgroundColor: darkMode ? '#252525' : '#fff', borderLeft: '4px solid #FFC107' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <MeetingRoom color="warning" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">Vacant Units</Typography>
                </Box>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {properties.reduce((acc, property) => acc + ((property.totalUnits || 0) - (property.occupiedUnits || 0)), 0)}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, height: '100%', backgroundColor: darkMode ? '#252525' : '#fff', borderLeft: '4px solid #9C27B0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Apartment color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">Total Units</Typography>
                </Box>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {properties.reduce((acc, property) => acc + (property.totalUnits || 0), 0)}
                </Typography>
              </Card>
            </Grid>
          </Grid>

          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Property</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Occupancy</TableCell>
                  <TableCell>Rent</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>{property.name}</TableCell>
                    <TableCell>{property.address}</TableCell>
                    <TableCell>
                      <Chip label={property.status || 'Active'} color="success" size="small" />
                    </TableCell>
                    <TableCell>{property.occupiedUnits || 0}/{property.totalUnits || 0}</TableCell>
                    <TableCell>KSh {property.rentAmount ? property.rentAmount.toLocaleString() : 0}</TableCell>
                    <TableCell>
                      <Button startIcon={<Edit />} onClick={() => handleEdit(property.id)} size="small" sx={{ mr: 1 }}>Edit</Button>
                      <Button startIcon={<Delete />} onClick={() => handleDelete(property.propertyNo)} color="error" size="small">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </Box>
  );
};

export default PropertyManagement;

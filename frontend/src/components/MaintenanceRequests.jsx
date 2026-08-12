import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Chip,
  TextField,
  Container,
  Card,
  Grid,
  Button
} from '@mui/material';
import {
  Build,
  Search as SearchIcon
} from '@mui/icons-material';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const MaintenanceRequests = () => {
  const [rows, setRows] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const maintenanceRef = collection(db, 'maintenanceRequests');
    const q = query(maintenanceRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const requests = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            issue: data.issue || data.title || 'General Maintenance',
            propertyName: data.propertyName || 'Renta Property',
            unit: data.unit || 'A-101',
            tenantName: data.tenantName || 'Tenant User',
            status: data.status || 'SUBMITTED',
            priority: data.priority || 'Medium'
          };
        });

        const filtered = requests.filter((req) => {
          const matchesStatus = selectedStatus === 'All Statuses' || req.status === selectedStatus;
          const matchesSearch =
            req.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.propertyName.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesStatus && matchesSearch;
        });

        setRows(filtered);
      },
      (error) => {
        console.error('Error fetching maintenance requests:', error);
      }
    );

    return () => unsubscribe();
  }, [selectedStatus, searchQuery]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'maintenanceRequests', id), { status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const columns = [
    { field: 'issue', headerName: 'Issue / Description', flex: 1, minWidth: 200 },
    { field: 'propertyName', headerName: 'Property', flex: 1, minWidth: 150 },
    { field: 'unit', headerName: 'Unit', flex: 1, minWidth: 90 },
    { field: 'tenantName', headerName: 'Tenant', flex: 1, minWidth: 140 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Select
          value={params.value}
          onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
          size="small"
          sx={{ minWidth: 120, py: 0.5 }}
        >
          <MenuItem value="SUBMITTED">Submitted</MenuItem>
          <MenuItem value="ASSIGNED">Assigned</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="RESOLVED">Resolved</MenuItem>
          <MenuItem value="CLOSED">Closed</MenuItem>
        </Select>
      )
    },
    {
      field: 'priority',
      headerName: 'Priority',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'High' || params.value === 'Urgent' ? 'error' : 'warning'}
          size="small"
        />
      )
    }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Container maxWidth="xl" disableGutters>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Build sx={{ fontSize: '2rem' }} />
                Maintenance Requests
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {rows.length} tickets recorded
              </Typography>
            </Box>
          </Box>

          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{ flex: 2 }}
              />
              <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} size="small" sx={{ minWidth: 160 }}>
                <MenuItem value="All Statuses">All Statuses</MenuItem>
                <MenuItem value="SUBMITTED">Submitted</MenuItem>
                <MenuItem value="ASSIGNED">Assigned</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
              </Select>
            </Box>
          </Card>

          <Card sx={{ p: 2 }}>
            <Box sx={{ height: 500 }}>
              <DataGrid rows={rows} columns={columns} pageSizeOptions={[10, 25]} />
            </Box>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default MaintenanceRequests;
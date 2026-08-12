import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Chip,
  Card,
  CardContent,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Shield as ShieldIcon,
  PhotoCamera as PhotoCameraIcon,
  Visibility,
  VisibilityOff,
  Save as SaveIcon
} from '@mui/icons-material';
import Navigation from './Navigation';
import api from '../services/api';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Feedback State
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/me');
      if (res.data && res.data.success) {
        const user = res.data.user;
        setUserData(user);
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
        setAvatar(user.avatar || '');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password && password !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const updateData = { name, email, phone, avatar };
      if (password) {
        updateData.password = password;
      }

      const res = await api.put('/auth/profile', updateData);
      if (res.data && res.data.success) {
        const updatedUser = res.data.user;
        setUserData(updatedUser);
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('tenantToken', res.data.token);
        }
        if (updatedUser.role) {
          localStorage.setItem('userRole', updatedUser.role);
        }
        setSuccess('Profile and login credentials updated successfully in database!');
        setPassword('');
        setConfirmPassword('');
      } else {
        throw new Error(res.data.message || 'Profile update failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Left Navigation Drawer */}
      <Navigation />

      {/* Main Profile Layout Container */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 4 }, 
          width: { md: `calc(100% - 260px)` },
          pb: 6 
        }}
      >
        <Container maxWidth="lg" disableGutters>
          <Box sx={{ mb: 4, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              User Profile & Credentials
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and update your account details, profile picture, and login password.
            </Typography>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {/* Left Column: User Summary Card */}
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                  <Box position="relative" display="inline-block" mb={2}>
                    <Avatar
                      src={avatar || undefined}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        fontSize: 40,
                        bgcolor: 'primary.main',
                        boxShadow: 3
                      }}
                    >
                      {name ? name[0].toUpperCase() : 'U'}
                    </Avatar>
                    <IconButton
                      component="label"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'secondary.main',
                        color: '#fff',
                        '&:hover': { bgcolor: 'secondary.dark' }
                      }}
                    >
                      <PhotoCameraIcon fontSize="small" />
                      <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} />
                    </IconButton>
                  </Box>

                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    {name || 'User Account'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {email}
                  </Typography>

                  <Chip
                    icon={<ShieldIcon style={{ fontSize: 16 }} />}
                    label={userData?.role || localStorage.getItem('userRole') || 'TENANT'}
                    color="primary"
                    sx={{ fontWeight: 700, px: 1, py: 0.5 }}
                  />

                  <Divider sx={{ my: 3 }} />

                  <Box textAlig="left">
                    <Typography variant="caption" color="text.secondary" display="block">
                      Organization
                    </Typography>
                    <Typography variant="body2" fontWeight={600} mb={1.5}>
                      {userData?.organization?.name || 'Default Property Management Org'}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" display="block">
                      Account Status
                    </Typography>
                    <Chip label={userData?.status || 'Active'} color="success" size="small" sx={{ fontWeight: 600 }} />
                  </Box>
                </Paper>
              </Grid>

              {/* Right Column: Editable Profile Form */}
              <Grid item xs={12} md={8}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight={700} mb={3}>
                    Account Details & Log In Credentials
                  </Typography>

                  <form onSubmit={handleProfileSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address (Login Username)"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Avatar URL (Image Link)"
                          value={avatar.startsWith('data:') ? 'Image uploaded from device' : avatar}
                          onChange={(e) => setAvatar(e.target.value)}
                          placeholder="e.g. https://example.com/avatar.jpg"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }}>
                          <Chip label="Change Password Credentials" size="small" />
                        </Divider>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="New Password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Leave blank to keep current password"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ mt: 2 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          disabled={saving}
                          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                          sx={{ py: 1.5, px: 4, borderRadius: 2, fontWeight: 700 }}
                        >
                          {saving ? 'Saving Changes...' : 'Save Profile & Credentials'}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Container>

        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
        </Snackbar>

        <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
          <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Profile;

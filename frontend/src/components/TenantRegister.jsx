import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  MenuItem,
  useTheme,
  useMediaQuery,
  Container,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GoogleIcon from '@mui/icons-material/Google';
import { setDoc, doc, collection, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const TenantRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("TENANT");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Call backend REST API for registration
      const res = await api.post('/auth/register', {
        name,
        email,
        phone,
        password,
        role
      });

      if (res.data && res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('tenantToken', res.data.token);
        localStorage.setItem('userRole', res.data.user.role);

        setSuccess("Registration successful! Redirecting to dashboard...");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        throw new Error(res.data.message || "Registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
        padding: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          <Box
            sx={{
              p: 3,
              background: "linear-gradient(90deg, #1a237e 0%, #283593 100%)",
              color: "#fff",
              textAlign: "center"
            }}
          >
            <Typography variant="h5" fontWeight={700}>
              Renta Property Management
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Account Registration
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            <form onSubmit={handleRegister}>
              <TextField 
                label="Full Name" 
                fullWidth 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                sx={{ mb: 2 }}
              />
              <TextField 
                label="Email Address" 
                type="email" 
                fullWidth 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                sx={{ mb: 2 }}
              />
              <TextField 
                label="Phone Number" 
                type="tel" 
                fullWidth 
                required 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                sx={{ mb: 2 }}
              />

              {/* Core Role Selection */}
              <TextField
                select
                label="Select Account Role"
                fullWidth
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                sx={{ mb: 2 }}
                helperText="Select your role in the system"
              >
                <MenuItem value="SUPER_ADMINISTRATOR">Super Administrator (Platform Level)</MenuItem>
                <MenuItem value="PROPERTY_MANAGER">Property Manager (Operational Control)</MenuItem>
                <MenuItem value="LANDLORD">Landlord / Owner (Investment Performance)</MenuItem>
                <MenuItem value="TENANT">Tenant (Self-Service Portal)</MenuItem>
              </TextField>

              <TextField 
                label="Password" 
                type={showPassword ? "text" : "password"} 
                fullWidth 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField 
                label="Confirm Password" 
                type={showPassword ? "text" : "password"} 
                fullWidth 
                required 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                sx={{ mb: 3 }}
              />

              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                disabled={loading} 
                size="large"
                sx={{ 
                  mb: 2, 
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 700
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : `Register as ${role.replace('_', ' ')}`}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Button 
                    variant="text" 
                    size="small" 
                    onClick={() => navigate("/tenant/login")}
                    sx={{ fontWeight: 600 }}
                  >
                    Login here
                  </Button>
                </Typography>
              </Box>
            </form>
          </Box>
        </Paper>
      </Container>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")}>
        <Alert severity="error" onClose={() => setError("")}>{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess("")}>
        <Alert severity="success" onClose={() => setSuccess("")}>{success}</Alert>
      </Snackbar>
    </Box>
  );
};

export default TenantRegister;
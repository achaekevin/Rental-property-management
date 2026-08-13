import React, { useState } from "react";
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
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
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
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
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
              background: "linear-gradient(90deg, #1976d2 0%, #1565c0 100%)",
              color: "#fff",
              textAlign: "center",
              position: "relative"
            }}
          >
            <IconButton
              onClick={() => navigate('/')}
              sx={{ position: 'absolute', left: 16, top: 16, color: '#fff' }}
              title="Back to Landing Page"
            >
              <ArrowBack />
            </IconButton>

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
                InputLabelProps={{ shrink: true }}
                placeholder="Enter your full name"
                sx={{ mb: 2.5 }}
              />

              <TextField 
                label="Email Address" 
                type="email" 
                fullWidth 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                InputLabelProps={{ shrink: true }}
                placeholder="Enter your email address"
                sx={{ mb: 2.5 }}
              />

              <TextField 
                label="Phone Number" 
                type="tel" 
                fullWidth 
                required 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                InputLabelProps={{ shrink: true }}
                placeholder="Enter your phone number"
                sx={{ mb: 2.5 }}
              />

              {/* Core Role Selection */}
              <TextField
                select
                label="Select Account Role"
                fullWidth
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2.5 }}
                helperText="Select your role in the property system"
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
                InputLabelProps={{ shrink: true }}
                placeholder="Create a password"
                sx={{ mb: 2.5 }}
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
                InputLabelProps={{ shrink: true }}
                placeholder="Confirm your password"
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
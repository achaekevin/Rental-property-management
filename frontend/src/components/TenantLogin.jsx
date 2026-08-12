import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Container
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from '../services/api';

const TenantLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/login', { email, password });

      if (res.data && res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("tenantToken", res.data.token);
        localStorage.setItem("userRole", res.data.user.role);

        navigate("/dashboard");
      } else {
        throw new Error(res.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed. Please check your credentials.");
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
        padding: { xs: 2, sm: 3 }
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ width: "100%", borderRadius: 3, overflow: "hidden", backgroundColor: "#ffffff" }}>
          <Box sx={{ p: 3, background: "linear-gradient(90deg, #1a237e 0%, #283593 100%)", color: "#fff", textAlign: "center" }}>
            <Typography variant="h5" fontWeight={700}>
              Renta Property Management
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              System Login Portal
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            <form onSubmit={handleLogin}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                sx={{ mb: 2.5 }}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                sx={{ mb: 3 }}
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

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                size="large"
                sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, mb: 2 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{" "}
                  <Button variant="text" size="small" onClick={() => navigate("/tenant/register")} sx={{ fontWeight: 600 }}>
                    Register here
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
    </Box>
  );
};

export default TenantLogin;
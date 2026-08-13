require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { sequelize } = require('./models');
const { sanitizeInputs, handleMalformedPayload } = require('./middleware/sanitize');

const app = express();

// Disable Powered-By Header to prevent server fingerprinting
app.disable('x-powered-by');

// 1. Enhanced Helmet Security Headers & HSTS Enforcement
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'", "http:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true
}));

// 2. Global Rate Limiter (Bot & DDoS Protection)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP address, please try again later.' }
});
app.use(globalLimiter);

// 3. Strict Auth Endpoint Rate Limiter (Brute-Force & Bot Protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Max 15 login/register attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts. Please try again after 15 minutes.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// 4. CORS Security Configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 5. Restrict JSON Payload Size (Field Tampering, Oversized & Malformed Payload Prevention)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 6. Handle Malformed JSON & Oversized Payload Errors
app.use(handleMalformedPayload);

// 7. Global Input Sanitization Middleware (XSS, Null Bytes & Script Injection Filtering)
app.use(sanitizeInputs);

// 8. Static Uploads Directory Middleware with Header Controls
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));

// Database Connection Authentication
sequelize.authenticate()
  .then(() => {
    console.log('Connected to MySQL 8.4 Database via Sequelize successfully.');
  })
  .catch(err => {
    console.error('MySQL Connection Failure:', err.message);
  });

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'UP', 
    service: 'Rental Property Management Backend API', 
    security: 'INPUT_SANITIZED_ENFORCED',
    timestamp: new Date() 
  });
});

// API Routes
app.use('/api/public', require('./routes/public'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/units', require('./routes/units'));
app.use('/api/tenants', require('./routes/tenants'));
app.use('/api/leases', require('./routes/leases'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/analytics', require('./routes/analytics'));

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Centralized Error Handling Middleware (Trim Stack Traces in Production)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Rental Property Management Backend running on port ${PORT} (0.0.0.0 - Network Accessible)`);
  });
}

module.exports = app;

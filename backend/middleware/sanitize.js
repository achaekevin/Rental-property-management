/**
 * Global Input Sanitization & Malformed Payload Prevention Middleware
 */

// Helper function to sanitize a single string value
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;

  return str
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove dangerous script tags and event handler patterns (XSS Prevention)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    // Trim leading/trailing whitespace
    .trim();
};

// Helper function to recursively sanitize objects and arrays
const sanitizeDeep = (data) => {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    return sanitizeString(data);
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeDeep(item));
  }

  if (typeof data === 'object' && data.constructor === Object) {
    const sanitizedObj = {};
    for (const [key, value] of Object.entries(data)) {
      // Sanitize object keys and values
      const cleanKey = sanitizeString(key);
      sanitizedObj[cleanKey] = sanitizeDeep(value);
    }
    return sanitizedObj;
  }

  return data;
};

/**
 * Middleware function to sanitize req.body, req.query, and req.params
 */
const sanitizeInputs = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeDeep(req.body);
  }
  if (req.query) {
    req.query = sanitizeDeep(req.query);
  }
  if (req.params) {
    req.params = sanitizeDeep(req.params);
  }
  next();
};

/**
 * Middleware function to catch JSON syntax errors / malformed payloads
 */
const handleMalformedPayload = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed payload error: Invalid or corrupted JSON body provided.'
    });
  }

  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Payload too large: Request body exceeds the maximum permitted size limit (1MB).'
    });
  }

  next(err);
};

module.exports = {
  sanitizeInputs,
  handleMalformedPayload,
  sanitizeString,
  sanitizeDeep
};

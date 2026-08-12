const authService = require('../services/auth.service');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token: result.token,
        user: result.user
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      res.json({
        success: true,
        message: 'Login successful',
        token: result.token,
        user: result.user
      });
    } catch (err) {
      res.status(401).json({ success: false, message: err.message });
    }
  }

  async me(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      res.json({ success: true, user });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  async updateProfile(req, res, next) {
    try {
      const result = await authService.updateProfile(req.user.id, req.body);
      res.json({
        success: true,
        message: 'Profile updated successfully',
        token: result.token,
        user: result.user
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new AuthController();

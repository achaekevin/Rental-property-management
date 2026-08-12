const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Organization } = require('../models');
const { JWT_SECRET } = require('../middleware/auth');

class AuthService {
  async register(userData) {
    const { name, email, password, role, phone, organizationId } = userData;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'TENANT',
      phone: phone || '',
      organizationId: organizationId || null
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email, organizationId: user.organizationId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        organizationId: user.organizationId
      }
    };
  }

  async login(credentials) {
    const { email, password } = credentials;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    if (user.status !== 'Active') {
      throw new Error('Account is not active');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email, organizationId: user.organizationId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        organizationId: user.organizationId
      }
    };
  }

  async getCurrentUser(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [{ model: Organization, as: 'organization', attributes: ['id', 'name'] }]
    });
    if (!user) throw new Error('User not found');
    const userData = user.toJSON();
    userData._id = user.id;
    return userData;
  }

  async updateProfile(userId, updateData) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const { name, email, phone, avatar, password } = updateData;

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) throw new Error('Email is already in use by another account');
      user.email = email;
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    if (password && password.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email, organizationId: user.organizationId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const updatedUser = user.toJSON();
    delete updatedUser.password;
    updatedUser._id = user.id;

    return { token, user: updatedUser };
  }
}

module.exports = new AuthService();

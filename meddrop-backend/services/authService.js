const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Auth service - handles all business logic for authentication operations
 */
class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User data (name, email, password)
   * @param {string} secret - JWT secret
   * @returns {Promise<Object>} User data and token
   */
  static async register(userData, secret) {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    };
  }

  /**
   * Login a user
   * @param {Object} loginData - Login data (email, password)
   * @param {string} secret - JWT secret
   * @returns {Promise<Object>} User data and token
   */
  static async login(loginData, secret) {
    const { email, password } = loginData;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    };
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User object
   */
  static async getUserById(userId) {
    return await User.findById(userId).select('-password');
  }
}

module.exports = AuthService;
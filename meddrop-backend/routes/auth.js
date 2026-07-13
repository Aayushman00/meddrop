require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/user');
const { validateRequiredFields } = require('../utils/validation');
const { successResponse, errorResponse } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');
const AuthService = require('../services/authService');

const router = express.Router();

/*
    @routes     POST /api/auth/signup
    @desc       Register a new user
*/

router.post('/signup', asyncHandler(async (req, res) => {
  // Validate required fields
  const requiredFields = ['name', 'email', 'password'];
  const errors = validateRequiredFields(req.body, requiredFields);

  if (Object.keys(errors).length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  // Register user through service
  const result = await AuthService.register(req.body, JWT_SECRET);

  // Return success response
  return successResponse(res, result, 'User registered successfully', 201);
}));

router.post('/login', asyncHandler(async (req, res) => {
  // Validate required fields
  const requiredFields = ['email', 'password'];
  const errors = validateRequiredFields(req.body, requiredFields);

  if (Object.keys(errors).length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  // Login user through service
  const result = await AuthService.login(req.body, JWT_SECRET);

  // Return success response
  return successResponse(res, result, 'User logged in successfully');
}));

module.exports = router;
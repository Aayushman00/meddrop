const MedicineService = require('../services/medicineService');
const { validateRequiredFields, hasNestedProperty } = require('../utils/validation');
const { successResponse, errorResponse } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Medicine controller - handles HTTP requests for medicine operations
 * Now uses service layer for business logic and utilities for validation/response
 */

/**
 * Create a new medicine
 * POST /api/medicines
 */
exports.createMedicine = asyncHandler(async (req, res) => {
  // Validate required fields
  const requiredFields = ['name', 'expiryDate', 'quantity'];
  const errors = validateRequiredFields(req.body, requiredFields);

  // Validate location if provided
  if (req.body.location && (!hasNestedProperty(req.body.location, 'lat') || !hasNestedProperty(req.body.location, 'lng'))) {
    errors.location = 'Location must contain lat and lng coordinates';
  }

  if (Object.keys(errors).length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  // Create medicine through service
  const medicine = await MedicineService.createMedicine(req.body, req.user.id);

  // Return success response
  return successResponse(res, medicine, 'Medicine created successfully', 201);
});

/**
 * Get all medicines for the current user
 * GET /api/medicines
 */
exports.getMedicines = asyncHandler(async (req, res) => {
  const medicines = await MedicineService.getUserMedicines(req.user.id);
  return successResponse(res, medicines, 'Medicines retrieved successfully');
});

/**
 * Delete a medicine by ID
 * DELETE /api/medicines/:id
 */
exports.deleteMedicine = asyncHandler(async (req, res) => {
  await MedicineService.deleteMedicine(req.params.id, req.user.id);
  return successResponse(res, null, 'Medicine deleted successfully');
});

/**
 * Update a medicine by ID
 * PATCH /api/medicines/:id
 */
exports.updateMedicine = asyncHandler(async (req, res) => {
  const medicine = await MedicineService.updateMedicine(req.params.id, req.body, req.user.id);
  return successResponse(res, medicine, 'Medicine updated successfully');
});
const RequestService = require('../services/requestService');
const { validateRequiredFields, isValidObjectId } = require('../utils/validation');
const { successResponse, errorResponse } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Request controller - handles HTTP requests for request operations
 * Now uses service layer for business logic and utilities for validation/response
 */

/**
 * Create a new medicine request
 * POST /api/requests
 */
exports.createRequest = asyncHandler(async (req, res) => {
  // Validate required fields
  const requiredFields = ['medicineId', 'quantity'];
  const errors = validateRequiredFields(req.body, requiredFields);

  // Validate medicineId format
  if (req.body.medicineId && !isValidObjectId(req.body.medicineId)) {
    errors.medicineId = 'Invalid medicine ID';
  }

  // Validate quantity is positive number
  if (req.body.quantity !== undefined && (isNaN(req.body.quantity) || req.body.quantity <= 0)) {
    errors.quantity = 'Quantity must be a positive number';
  }

  if (Object.keys(errors).length > 0) {
    return errorResponse(res, 'Validation failed', 400, errors);
  }

  // Create request through service
  const request = await RequestService.createRequest(req.body, req.user.id);

  // Return success response
  return successResponse(res, request, 'Request created successfully', 201);
});

/**
 * Get requests received by the current user
 * GET /api/requests/received
 */
exports.getReceivedRequests = asyncHandler(async (req, res) => {
  const requests = await RequestService.getReceivedRequests(req.user.id);
  return successResponse(res, requests, 'Received requests retrieved successfully');
});

/**
 * Get requests made by the current user
 * GET /api/requests/made
 */
exports.getMadeRequests = asyncHandler(async (req, res) => {
  const requests = await RequestService.getMadeRequests(req.user.id);
  return successResponse(res, requests, 'Made requests retrieved successfully');
});

/**
 * Respond to a request (accept or reject)
 * PATCH /api/requests/:id/respond
 */
exports.respondToRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate request ID
  if (!isValidObjectId(id)) {
    return errorResponse(res, 'Invalid request ID', 400);
  }

  // Validate status
  if (!status || !['accepted', 'rejected'].includes(status)) {
    return errorResponse(res, 'Invalid status. Must be "accepted" or "rejected"', 400);
  }

  // Respond to request through service
  const request = await RequestService.respondToRequest(id, status, req.user.id);

  // Return success response with populated request
  const populatedRequest = await RequestService.getRequestById(id);
  return successResponse(res, populatedRequest, `Request ${status} successfully`);
});

/**
 * Cancel a request (only by the requester)
 * DELETE /api/requests/:id
 */
exports.cancelRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate request ID
  if (!isValidObjectId(id)) {
    return errorResponse(res, 'Invalid request ID', 400);
  }

  // Cancel request through service
  const request = await RequestService.cancelRequest(id, req.user.id);

  // Return success response
  return successResponse(res, request, 'Request cancelled successfully');
});

/**
 * Restock medicine (only by medicine owner)
 * PATCH /api/requests/:id/restock
 */
exports.restockMedicine = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  // Validate medicine ID
  if (!isValidObjectId(id)) {
    return errorResponse(res, 'Invalid medicine ID', 400);
  }

  // Validate quantity
  if (quantity === undefined || isNaN(quantity) || quantity <= 0) {
    return errorResponse(res, 'Quantity must be a positive number', 400);
  }

  // Restock medicine through service
  const medicine = await RequestService.restockMedicine(id, parseInt(quantity), req.user.id);

  // Return success response
  return successResponse(res, medicine, 'Medicine restocked successfully');
});
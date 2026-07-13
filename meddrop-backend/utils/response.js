/**
 * Response utility functions for standardized API responses
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {any} data - Data to send in response
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message
  };

  if (data !== null) {
    // If data is an array, use plural form; otherwise use singular based on context
    if (Array.isArray(data)) {
      response[data.length > 1 ? 'medicines' : 'medicine'] = data;
      response[data.length > 1 ? 'requests' : 'request'] = data;
      response[data.length > 1 ? 'users' : 'user'] = data;
    } else {
      // For single objects, determine type based on properties or use generic
      response.data = data;
    }
  }

  res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {Object} errors - Validation errors object
 */
const errorResponse = (res, message = 'Error', statusCode = 400, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse
};
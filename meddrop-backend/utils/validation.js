/**
 * Validation utility functions
 */

/**
 * Validate required fields in request body
 * @param {Object} body - Request body
 * @param {Array<string>} requiredFields - Array of required field names
 * @returns {Object} Object with errors (empty if no errors)
 */
const validateRequiredFields = (body, requiredFields) => {
  const errors = {};

  requiredFields.forEach(field => {
    if (!body[field] && body[field] !== 0) { // Allow 0 as valid value
      errors[field] = `${field} is required`;
    }
  });

  return errors;
};

/**
 * Validate object has required nested properties
 * @param {Object} obj - Object to validate
 * @param {string} path - Dot notation path to check (e.g., 'location.lat')
 * @returns {boolean} True if property exists and is not null/undefined
 */
const hasNestedProperty = (obj, path) => {
  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (current == null || !(part in current)) {
      return false;
    }
    current = current[part];
  }

  return current !== null && current !== undefined;
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - String to validate as ObjectId
 * @returns {boolean} True if valid ObjectId format
 */
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

module.exports = {
  validateRequiredFields,
  hasNestedProperty,
  isValidObjectId
};
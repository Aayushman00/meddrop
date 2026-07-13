const Request = require('../model/request');
const Medicine = require('../model/medicine');

/**
 * Request service - handles all business logic for request operations
 */
class RequestService {
  /**
   * Create a new medicine request
   * @param {Object} requestData - Request data (medicineId, quantity)
   * @param {string} userId - ID of the user making the request
   * @returns {Promise<Object>} Created request
   */
  static async createRequest(requestData, userId) {
    const { medicineId, quantity } = requestData;

    // Find the medicine
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      throw new Error('Medicine not found');
    }

    // Check if user is trying to request their own medicine
    if (medicine.createdBy.toString() === userId) {
      throw new Error('Cannot request your own medicine');
    }

    // Check if medicine has sufficient quantity
    if (medicine.quantity < quantity) {
      throw new Error('Insufficient quantity available');
    }

    // Check if user already has a pending request for this medicine
    const existingRequest = await Request.findOne({
      requestedBy: userId,
      medicine: medicineId,
      status: 'pending'
    });

    if (existingRequest) {
      throw new Error('You have already made a pending request for this medicine');
    }

    // Create new request
    const request = new Request({
      requestedBy: userId,
      requestedTo: medicine.createdBy,
      medicine: medicineId,
      quantity
    });

    return await request.save();
  }

  /**
   * Get requests received by a user (requests where user is the recipient)
   * @param {string} userId - ID of the user
   * @returns {Promise<Array>} Array of requests
   */
  static async getReceivedRequests(userId) {
    return await Request.find({ requestedTo: userId })
      .populate('requestedBy', 'name email')
      .populate('medicine', 'name quantity');
  }

  /**
   * Get requests made by a user (requests where user is the requester)
   * @param {string} userId - ID of the user
   * @returns {Promise<Array>} Array of requests
   */
  static async getMadeRequests(userId) {
    return await Request.find({ requestedBy: userId })
      .populate('requestedTo', 'name email')
      .populate('medicine', 'name quantity');
  }

  /**
   * Respond to a request (accept or reject)
   * @param {string} requestId - Request ID
   * @param {string} status - New status ('accepted' or 'rejected')
   * @param {string} userId - ID of the user responding to the request (must be recipient)
   * @returns {Promise<Object>} Updated request with populated references
   */
  static async respondToRequest(requestId, status, userId) {
    // Validate status
    if (!['accepted', 'rejected'].includes(status)) {
      throw new Error('Invalid status');
    }

    // Find the request
    const request = await Request.findById(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    // Check if user is the recipient
    if (request.requestedTo.toString() !== userId) {
      throw new Error('Not authorized to respond to this request');
    }

    // Check if request is still pending
    if (request.status !== 'pending') {
      throw new Error('Request has already been processed');
    }

    // If accepting, check medicine availability and update quantity
    if (status === 'accepted') {
      const medicine = await Medicine.findOneAndUpdate(
        {
          _id: request.medicine,
          quantity: { $gte: request.quantity }
        },
        {
          $inc: { quantity: -request.quantity }
        },
        { new: true }
      );

      if (!medicine) {
        throw new Error('Insufficient quantity available');
      }
    }

    // Update request status
    request.status = status;
    await request.save();

    // Return populated request
    return await Request.findById(request._id)
      .populate('medicine', 'name quantity')
      .populate('requestedBy', 'name email')
      .populate('requestedTo', 'name email');
  }

  /**
   * Cancel a request (only by the requester)
   * @param {string} requestId - Request ID
   * @param {string} userId - ID of the user canceling the request (must be requester)
   * @returns {Promise<Object>} Updated request
   */
  static async cancelRequest(requestId, userId) {
    // Find the request
    const request = await Request.findById(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    // Check if user is the requester
    if (request.requestedBy.toString() !== userId) {
      throw new Error('Not authorized to cancel this request');
    }

    // Check if request is still pending
    if (request.status !== 'pending') {
      throw new Error('Only pending requests can be cancelled');
    }

    // Update request status
    request.status = 'rejected';
    request.cancelledByUser = true;
    await request.save();

    return request;
  }

  /**
   * Restock medicine (only by medicine owner)
   * @param {string} medicineId - Medicine ID
   * @param {number} quantity - Amount to add to medicine quantity
   * @param {string} userId - ID of the user requesting restock (must be medicine owner)
   * @returns {Promise<Object>} Updated medicine
   */
  static async restockMedicine(medicineId, quantity, userId) {
    // Find the medicine
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      throw new Error('Medicine not found');
    }

    // Check if user is the owner
    if (medicine.createdBy.toString() !== userId) {
      throw new Error('Not authorized to restock this medicine');
    }

    // Increase quantity
    medicine.quantity += quantity;
    return await medicine.save();
  }
}

module.exports = RequestService;
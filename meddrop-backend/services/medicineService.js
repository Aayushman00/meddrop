const Medicine = require('../model/medicine');

/**
 * Medicine service - handles all business logic for medicine operations
 */
class MedicineService {
  /**
   * Create a new medicine
   * @param {Object} medicineData - Medicine data
   * @param {string} userId - ID of the user creating the medicine
   * @returns {Promise<Object>} Created medicine
   */
  static async createMedicine(medicineData, userId) {
    const { name, expiryDate, quantity, notes, location } = medicineData;

    const medicine = new Medicine({
      name,
      expiryDate,
      quantity,
      notes,
      location,
      createdBy: userId
    });

    return await medicine.save();
  }

  /**
   * Get all medicines for a specific user
   * @param {string} userId - ID of the user
   * @returns {Promise<Array>} Array of medicines
   */
  static async getUserMedicines(userId) {
    return await Medicine.find({ createdBy: userId });
  }

  /**
   * Delete a medicine by ID (only if owned by user)
   * @param {string} medicineId - Medicine ID
   * @param {string} userId - ID of the user requesting deletion
   * @returns {Promise<void>}
   */
  static async deleteMedicine(medicineId, userId) {
    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      throw new Error('Medicine not found');
    }

    // Check ownership
    if (medicine.createdBy.toString() !== userId) {
      throw new Error('Not authorized to delete this medicine');
    }

    await medicine.deleteOne();
  }

  /**
   * Update a medicine by ID (only if owned by user)
   * @param {string} medicineId - Medicine ID
   * @param {Object} updateData - Data to update
   * @param {string} userId - ID of the user requesting update
   * @returns {Promise<Object>} Updated medicine
   */
  static async updateMedicine(medicineId, updateData, userId) {
    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      throw new Error('Medicine not found');
    }

    // Check ownership
    if (medicine.createdBy.toString() !== userId) {
      throw new Error('Not authorized to update this medicine');
    }

    // Update fields if provided
    if (updateData.name !== undefined) medicine.name = updateData.name;
    if (updateData.expiryDate !== undefined) medicine.expiryDate = updateData.expiryDate;
    if (updateData.quantity !== undefined) medicine.quantity = updateData.quantity;
    if (updateData.notes !== undefined) medicine.notes = updateData.notes;
    if (updateData.location !== undefined) medicine.location = updateData.location;

    return await medicine.save();
  }

  /**
   * Get medicine by ID (only if owned by user)
   * @param {string} medicineId - Medicine ID
   * @param {string} userId - ID of the user requesting the medicine
   * @returns {Promise<Object>} Medicine object
   */
  static async getMedicineById(medicineId, userId) {
    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      throw new Error('Medicine not found');
    }

    // Check ownership
    if (medicine.createdBy.toString() !== userId) {
      throw new Error('Not authorized to access this medicine');
    }

    return medicine;
  }
}

module.exports = MedicineService;
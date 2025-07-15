const Medicine = require('../model/medicine');

/*
    @routes POST /api/medicines
    @desc Add a new medicine
    @access Public (for now)
*/

// adds a new medicine
exports.createMedicine = async (req, res) => {
    try {
        const { name, expiryDate, quantity, notes, location } = req.body;

        const errors = {};
        if (!name || name.trim() === '') errors.name = 'Name is required';
        if (!expiryDate) errors.expiryDate = 'Expiry date is required';
        if (!quantity || quantity <= 0) errors.quantity = 'Quantity must be greater than 0';

        if (!location || !location.lat || !location.lng) {
            errors.location = 'Pickup location is required';
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const newMed = new Medicine({
            name,
            expiryDate,
            quantity,
            notes,
            location,
            createdBy: req.user.id
        });

        const savedMed = await newMed.save();
        return res.status(201).json({ success: true, medicine: savedMed });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


// gets all the medicines for the logged-in user
exports.getMedicines = async (req, res) => {
    try {
        const meds = await Medicine.find({ createdBy: req.user.id });
        return res.status(200).json({ success: true, medicines: meds });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// deletes the medicine by ID
exports.deleteMedicine = async (req, res) => {
    try {
        const userId = req.user.id;
        const medicine = await Medicine.findById(req.params.id);

        if (!medicine) {
            return res.status(404).json({ success: false, message: 'Medicine not found' });
        }

        if (medicine.createdBy.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await medicine.deleteOne();
        return res.status(200).json({ success: true, message: 'Medicine deleted successfully' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


exports.updateMedicine = async (req, res) => {
    try {
        const userId = req.user.id;
        const medicineId = req.params.id;
        
        const medicine = await Medicine.findById(medicineId);
        if (!medicine) {
            return res.status(404).json({ success: false, message: 'Medicine not found' });
        }

        if (medicine.createdBy.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const { name, expiryDate, quantity, notes, location } = req.body;

        if (location !== undefined) medicine.location = location;
        if (name !== undefined) medicine.name = name;
        if (expiryDate !== undefined) medicine.expiryDate = expiryDate;
        if (quantity !== undefined) medicine.quantity = quantity;
        if (notes !== undefined) medicine.notes = notes;

        const updatedMed = await medicine.save();
        return res.status(200).json({ success: true, medicine: updatedMed });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}
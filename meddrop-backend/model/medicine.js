const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    expiryDate: {
        type: Date,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    notes: {
        type: String,
        default: ''
    },

    createdAt: {
        type: Date, 
        default: Date.now
    },

    location: {
        lat: {type: Number, required: true},
        lng: {type: Number, required: true}
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Medicine', MedicineSchema);
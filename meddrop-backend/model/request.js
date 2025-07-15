const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    requestedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    requestedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    medicine: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Medicine', 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true
    },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected'], 
        default: 'pending' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },

    cancelledByUser: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Request', requestSchema);

const Request = require('../model/request');
const Medicine = require('../model/medicine');


// request medicines
exports.createRequest = async (req, res) => {
    try {
        const { medicineId, quantity } = req.body;

        const medicine = await Medicine.findById(medicineId);
        if (!medicine) {
            return res.status(404).json({ success: false, message: 'Medicine not found' });
        }

        if (medicine.createdBy.toString() === req.user.id) {
            return res.status(400).json({ success: false, message: 'Cannot request your own medicine' });
        }

        if (medicine.quantity < quantity) {
            return res.status(400).json({ success: false, message: 'Insufficient quantity available' });
        }

        // if already exists logic here ->
        const existing = await Request.findOne({
            requestedBy: req.user.id,
            medicine: medicineId,
            status: 'pending'
        });

        if (existing) {
            return res.status(409).json({ success: false, message: 'You have already made a pending request for this medicine' });
        }

        const newRequest = new Request({
            requestedBy: req.user.id,
            requestedTo: medicine.createdBy,
            medicine: medicineId,
            quantity
        });

        await newRequest.save();

        return res.status(201).json({ success: true, request: newRequest });    
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


// get requests recieved by the users
exports.getReceivedRequests = async (req, res) => {
    try {
        const request = await Request.find({ requestedTo: req.user.id })
            .populate('requestedBy', 'name email')
            .populate('medicine', 'name quantity');

        
        return res.status(200).json({ success: true, requests: request });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// get requests made by the user
exports.getMadeRequests = async (req, res) => {
    try {
        const requests = await Request.find({ requestedBy: req.user.id })
            .populate('requestedTo', 'name email')
            .populate('medicine', 'name quantity');


        return res.status(200).json({ success: true, requests });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// accept or reeject a request
exports.respondToRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if(!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const request = await Request.findById(id);

        if(!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        if(request.requestedTo.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to respond to this request' });
        }

        if(request.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Request already processed' });
        }

        if(status === 'accepted') {
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
                return res.status(400).json({ success: false, message: 'Insufficient quantity available' });
            }
        }

        request.status = status;
        await request.save();

        // populating the request with mediccine and user details
        const populatedRequest = await Request.findById(request._id)
            .populate('medicine', 'name quantity')
            .populate('requestedBy', 'name email')
            .populate('requestedTo', 'name email');
        return res.status(200).json({ success: true, request });
    } catch (err) {
        console.error(err);
        return res.status(500).json({success: false, message: "Server error"});
    }
};

// cancel a request
exports.cancelRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await Request.findById(id);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        if (request.requestedBy.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to cancel this request' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Only pending requests can be cancelled' });
        }

        request.status = 'rejected';
        request.cancelledByUser = true;

        await request.save();

        return res.status(200).json({ success: true, request });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


// if a user needs more medicines that they have
exports.restockMedicine = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    const medicine = await Medicine.findById(id);
    if (!medicine || medicine.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "Not authorized" });
    }

    medicine.quantity += quantity;
    await medicine.save();

    return res.status(200).json({ success: true, medicine });
};

const express = require('express');
const router = express.Router();
const Medicine = require('../model/medicine');
const auth = require('../middleware/auth');

const {
    createMedicine,
    getMedicines,
    deleteMedicine,
    updateMedicine
} = require('../controllers/medicineController');

router.post('/', auth, createMedicine)
router.get('/', auth, getMedicines);
router.delete('/:id', auth, deleteMedicine);
router.patch('/:id', auth, updateMedicine);

module.exports = router; 
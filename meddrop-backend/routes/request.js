const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  createRequest,
  getReceivedRequests,
  getMadeRequests,
  respondToRequest,
  cancelRequest,
  restockMedicine
} = require('../controllers/requestController');

router.post('/', auth, createRequest);
router.get('/received', auth, getReceivedRequests);
router.get('/made', auth, getMadeRequests);
router.patch('/:id/respond', auth, respondToRequest);
router.delete('/:id', auth, cancelRequest);
router.patch('/:id/restock', auth, restockMedicine);

module.exports = router;
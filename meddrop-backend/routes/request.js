const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  createRequest,
  getReceivedRequests,
  getMadeRequests,
  respondToRequest
} = require('../controllers/requestController');

router.post('/', auth, createRequest);
router.get('/received', auth, getReceivedRequests);
router.get('/made', auth, getMadeRequests);
router.patch('/:id/respond', auth, respondToRequest);

module.exports = router;

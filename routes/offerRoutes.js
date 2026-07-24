const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getOffersForWorker,
  createOffer,
  getOffersByLender,
  acceptOffer,
  rejectOffer,
  requestReverseAuctionBids,
} = require('../controllers/offerController');

router.get('/worker', protect, authorize('worker'), getOffersForWorker);
router.post('/request-bids', protect, authorize('worker'), requestReverseAuctionBids);
router.post('/:id/accept', protect, authorize('worker'), acceptOffer);
router.post('/:id/reject', protect, authorize('worker'), rejectOffer);

router.post('/', protect, authorize('lender'), createOffer);
router.get('/lender', protect, authorize('lender'), getOffersByLender);

module.exports = router;

const express = require("express"),
			router = express.Router(),
			FcsController = require('../../controllers/FcsController');

router.post('/fees', FcsController.createFcs);
router.post('/compute-transaction-fee', FcsController.computeTransactionFee);

module.exports = router;
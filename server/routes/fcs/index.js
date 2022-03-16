const express = require("express"),
			router = express.Router(),
			FcsController = require('../../controllers/FcsController');

router.post('/fees', FcsController.createFcs);

module.exports = router;
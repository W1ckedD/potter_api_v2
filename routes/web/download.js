const express = require('express');
const { getDownloadApp } = require('../../controllers/web/download');

const router = express.Router();

router.get('/', getDownloadApp);

module.exports = router;
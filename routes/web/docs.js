const express = require('express');
const { getDocs } = require('../../controllers/web/docs');

const router = express.Router();

router.get('/', getDocs);

module.exports = router;
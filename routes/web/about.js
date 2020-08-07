const express = require('express');
const { getAboutUs, getContacttUs } = require('../../controllers/web/about');

const router = express.Router();

router.get('/about-us', getAboutUs);
router.get('/contact-us', getContacttUs);

module.exports = router;
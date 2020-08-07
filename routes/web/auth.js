const express = require('express');
const { getLogin, getRegister } = require('../../controllers/web/auth');

const router = express.Router();

router.get('/login', getLogin);
router.get('/register', getRegister);

module.exports = router;
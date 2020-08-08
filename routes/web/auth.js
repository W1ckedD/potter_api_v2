const express = require('express');
const { getLogin, getRegister, postRegister, verify, getDashboard } = require('../../controllers/web/auth');

const router = express.Router();

router.get('/dashboard', getDashboard);
router.get('/verify-account/:token', verify);
router.get('/login', getLogin);
router.get('/register', getRegister);
router.post('/register', postRegister);

module.exports = router;
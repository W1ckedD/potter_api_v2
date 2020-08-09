const express = require('express');
const { getStudents, getAllCharacters } = require('../../controllers/api/characters');
const router = express.Router();

router.get('/students', getStudents);
router.get('/', getAllCharacters);

module.exports = router;
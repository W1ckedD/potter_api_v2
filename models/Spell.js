const mongoose = require('mongoose');

const spellSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: String,
    pronunciation: String,
    desc: String,
    etymology: String,
    notes: String,
});

module.exports = mongoose.model('Spell', spellSchema);

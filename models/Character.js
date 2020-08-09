const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imageUrl: String,
    biographicalInformation: {
        born: String,
        died: String,
        bloodStatus: String,
        maritialStatus: String,
        nationality: String,
        aka: String,
    },
    physicalInformation: {
        species: String,
        gender: String,
        hairColor: String,
        skinColor: String,
        eyeColor: String,
    },
    magicalCharactristics: {
        boggart: String,
        wand: String,
        patronus: String,
    },
    affiliation: {
        occupation: String,
        house: String,
        loyalty: String,
    },
    desc: String,
});

module.exports = mongoose.model('Character', characterSchema);

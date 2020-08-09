const Character = require('../../models/Character');

exports.getMainCharacters = async (req, res, next) => {
    try {
        const chars = await Character.find();
        return res.status(200).json({
            success: true,
            chars: chars.slice(0, 22),
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            errro: 'Server error',
        });
    }
};

exports.getAllCharacters = async (req, res, next) => {
    try {
        const chars = await Character.find();
        return res.status(200).json({
            success: true,
            chars,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            errro: 'Server error',
        });
    }
};

exports.getCharacterById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const char = await Character.findById(id);
        return res.status(200).json({
            success: true,
            char,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Server error',
        });
    }
};

exports.getStudents = async (req, res, next) => {
    try {
        const chars = await Character.find({
            name: { $regex: '/arry/' },
        });
        
        return res.status(200).json({
            success: true,
            chars
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Server error'
        })
    }
};

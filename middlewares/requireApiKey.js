const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const { API_KEY } = req.headers;
        if (!API_KEY) {
            return res.status(403).json({
                error: 'Invalid API key',
            });
        }
        const user = await User.findOne({ apiKey: API_KEY });
        if (!user) {
            return res.status(403).json({
                error: 'Invalid API key',
            });
        }
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

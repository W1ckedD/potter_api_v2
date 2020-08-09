const User = require('../../models/User');
const bcrypt = require('bcrypt');

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, isVerified: true });
        if (!user) {
            return res.status(422).json({
                error: 'Invalid credentials' 
            })
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(422).json({
                error: 'Invalid credentials' 
            })
        }

        return res.status(200).json({
            success: true,
            user,
            API_KEY: user.apiKey
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Server error' });
    }
}
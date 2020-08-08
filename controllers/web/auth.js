const crypto = require('crypto');
const User = require('../../models/User');
const uuidApikey = require('uuid-apikey');
const transporter = require('../../config/transporter');
const { verifyAccountEmail, newUserRegisterd } = require('../../config/emails');

exports.getDashboard = (req, res, next) => {
    return res.render('auth/dashboard.ejs', { path: '' });
};

exports.getLogin = (req, res, next) => {
    return res.render('auth/login.ejs', {
        path: '/login',
    });
};

exports.getRegister = (req, res, next) => {
    // req.flash('info', 'It works');

    res.render('auth/register.ejs', {
        path: '/register',
    });
};

exports.postRegister = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email, isVerified: false });
        if (existingUser) {
            let token;
            crypto.randomBytes(20, async (err, buffer) => {
                if (err) {
                    console.log(err);
                }
                token = buffer.toString('hex');
                existingUser.verifyToken = token;
                existingUser.verifyTokenExpiryDate = Date.now() + 3600000;
                await existingUser.save();
            });
            const message = verifyAccountEmail(token, existingUser.email);
            const result = await transporter.sendMail(message);
            return res.render('auth/verify-account.ejs', {
                path: '',
            });
        }
        let token;
        crypto.randomBytes(20, async (err, buffer) => {
            if (err) {
                console.log(err);
            }
            token = buffer.toString('hex');
            const user = await User.create({
                email,
                password,
                verifyToken: token,
                verifyTokenExpiryDate: Date.now() + 3600000,
            });
            const message = verifyAccountEmail(token, user.email);
            const result = await transporter.sendMail(message);
            return res.render('auth/verify-account.ejs', {
                path: '',
            });
        });
    } catch (err) {
        console.log(err);
        return res.redirect('/');
    }
};

exports.verify = async (req, res, next) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiryDate: { $gt: Date.now() },
        });

        if (!user) {
            return res.redirect('/');
        }
        user.verifyToken = undefined;
        user.verifyTokenExpiryDate = undefined;
        user.isVerified = true;
        user.apiKey = uuidApikey.create().apiKey;
        await user.save();
        const message = newUserRegisterd(user);
        const result = await transporter.sendMail(message);
        return res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        return res.redirect('/');
    }
};

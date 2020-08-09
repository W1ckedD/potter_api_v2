const User = require('../../models/User');
const RequestLog = require('../../models/RequestLog');
const crypto = require('crypto');
const uuidApikey = require('uuid-apikey');
const transporter = require('../../config/transporter');
const bcrypt = require('bcrypt');
const { verifyAccountEmail, newUserRegisterd } = require('../../config/emails');
const {
    registered,
    reRegistered,
    verified,
    loggedIn,
    loggedOut,
} = require('../../config/logTypes');

exports.getDashboard = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.render('errors/error.ejs', {
            path: '',
            errorMessage: 'You must be logged in',
        });
    }
    const { user } = req.session;
    return res.render('auth/dashboard.ejs', { path: '/dashboard', user });
};

exports.getLogin = (req, res, next) => {
    let errorMessage = req.flash('error');
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }
    return res.render('auth/login.ejs', {
        path: '/login',
        errorMessage,
    });
};

exports.postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, isVerified: true });
        if (!user) {
            req.flash('error', 'Invalid credntials');
            return res.redirect('/login');
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            req.flash('error', 'Invalid credntials');
            return res.redirect('/login');
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        const log = await RequestLog.create({
            user_id: user._id,
            type: loggedIn,
            method: req.method,
            ipAddress: req.connection.remoteAddress,
        });
        return res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        return res.render('errors/error.ejs', {
            path: '',
            errorMessage: 'Server error',
        });
    }
};

exports.getRegister = (req, res, next) => {
    let errorMessage = req.flash('error');
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }
    res.render('auth/register.ejs', {
        path: '/register',
        errorMessage,
    });
};

exports.postRegister = async (req, res, next) => {
    try {
        const { email, password, password2 } = req.body;
        if (password.length < 8) {
            req.flash('error', 'Password must be at least 8 characters');
            return res.redirect('/register');
        }
        if (password !== password2) {
            req.flash('error', 'Passwords do not match');
            return res.redirect('/register');
        }
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
            const log = await RequestLog.create({
                user_id: user._id,
                type: reRegistered,
                method: req.method,
                ipAddress: req.connection.remoteAddress,
            });
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
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                email,
                password: hashedPassword,
                verifyToken: token,
                verifyTokenExpiryDate: Date.now() + 3600000,
            });
            const message = verifyAccountEmail(token, user.email);
            const result = await transporter.sendMail(message);
            const log = await RequestLog.create({
                user_id: user._id,
                type: registered,
                method: req.method,
                ipAddress: req.connection.remoteAddress,
            });
            return res.render('auth/verify-account.ejs', {
                path: '',
            });
        });
    } catch (err) {
        if (err.code === 11000) {
            req.flash('error', 'This email is already registered');
            return res.redirect('/register');
        }
        console.log(err);
        return res.render('errors/error.ejs', {
            path: '',
            errorMessage: 'Server error',
        });
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
        req.session.isLoggedIn = true;
        req.session.user = user;
        const log = await RequestLog.create({
            user_id: user._id,
            type: verified,
            method: req.method,
            ipAddress: req.connection.remoteAddress,
        });
        return res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        return res.render('errors/error.ejs', {
            path: '',
            errorMessage: 'Server error',
        });
    }
};

exports.postLogout = async (req, res, next) => {
    const log = await RequestLog.create({
        user_id: req.session.user._id,
        type: loggedOut,
        method: req.method,
        ipAddress: req.connection.remoteAddress,
    });
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }

        return res.redirect('/');
    });
};

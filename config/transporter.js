const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.API_EMAIL,
        pass: process.env.MAIL_PASS,
    },
});

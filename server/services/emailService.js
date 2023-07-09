const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    secure: false
});

const sendMail = (to, subject, text) => {
    const mailOptions = {
        "from": process.env.EMAIL,
        "to" : to,
        "subject" : subject,
        "text" : text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log('Email sent: ' + info.response);

            return true;
        }
    });
};

module.exports = { sendMail };
const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler');

const sendMail = asyncHandler(async ({email, html}) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_NAME, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Bạn đã bị hacker xâm chiếm 👻" <no-relply@hacker.com>', // sender address
        to: email, // list of receivers
        subject: "Forgot password ✔", // Subject line
        html: html, // html body
    });

    return info;
})

module.exports = sendMail
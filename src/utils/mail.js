require('dotenv').config('../../.env')

const nodemailer = require('nodemailer')

const sendEmail = async (email, subject, message) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_AUTH_USER,
            pass: process.env.SMTP_AUTH_PASS, 
        }
    })

    const mailOptions = {
        from: process.env.MAIL_SUPPORT_ADDRESS,
        to: email,
        subject: subject,
        text: message
    }

    return transporter.sendMail(mailOptions)
}

module.exports = {
    sendEmail
}
    

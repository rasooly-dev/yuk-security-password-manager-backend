require('dotenv').config('../../.env')

const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'

const axios = require('axios')

const verify = async (req, res, next) => {

    const recaptcha_token = req.body.recaptcha_token

    if (!recaptcha_token)
        return res.status(400).json({
            message: 'No reCAPTCHA token provided',
            error: 'NoRecaptchaTokenProvidedException'
        })

    axios.post(RECAPTCHA_VERIFY_URL, null, {
        params: {
            secret: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
            response: recaptcha_token
        }
    })
        .then(response => {

            if (!response.data.success)
                return res.status(401).json({
                    message: 'Invalid reCAPTCHA token',
                    error: 'InvalidRecaptchaTokenException'
                })
            
            req.recaptcha = response.data

            next()
        })
        .catch(err => {
            return res.status(500).json({
                message: 'Internal server error',
                error: 'InternalServerException'
            })
        })
}

module.exports = {
    verify
}
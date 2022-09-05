require('dotenv').config('../../.env')

// Set a variable to hold the recaptcha token verification api url
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'

// import axios to make http requests
// easier
const axios = require('axios')

/**
 * Function that verifies a recaptcha token
 * 
 * @param { Request } req a request object
 * @param { Response } res a response object
 * @param { NextFunction } next a next function
 * 
 * @returns a response object containing the recaptcha token verification result
 * 
 * @throws an exception if the recaptcha token is invalid
 */
const verify = async (req, res, next) => {

    // grab the recaptcha token from the request body
    const recaptcha_token = req.body.recaptcha_token

    // if there is no recaptcha token,
    // throw an exception
    if (!recaptcha_token)
        return res.status(400).json({
            message: 'No reCAPTCHA token provided',
            error: 'NoRecaptchaTokenProvidedException'
        })

    // verify the recaptcha token by sending a post request
    // to the recaptcha token verification api
    axios.post(RECAPTCHA_VERIFY_URL, null, {
        // include the recaptcha token and secret key
        params: {
            secret: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
            response: recaptcha_token
        }
    })
        .then(response => {
            // if the recaptcha token is invalid,
            // throw an exception
            if (!response.data.success)
                return res.status(401).json({
                    message: 'Invalid reCAPTCHA token',
                    error: 'InvalidRecaptchaTokenException'
                })
            
            // if the recaptcha token is valid,
            // set the recaptcha token verification result
            // to the response object
            req.recaptcha = response.data

            // call the next function
            next()
        })
        .catch(err => {
            // if there is an error, throw an exception
            return res.status(500).json({
                message: 'Internal server error',
                error: 'InternalServerException'
            })
        })
}

// export the functions
module.exports = {
    verify
}
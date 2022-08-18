require('dotenv').config('../../.env')

const jwt = require('jsonwebtoken')


/**
 * Method to sign an access token
 * 
 * @param { Object } user an object holding the user's id and username
 * @param { String OR Integer } exp a string or integer representing the expiration time of the token
 * @returns a signed access token
 */
const signAccessToken = (user, exp) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: exp }
    )
}

/**
 * Method to sign a refresh token
 * 
 * @param { Object } user an object holding the user's id and username
 * @param { String OR Integer } exp a string or integer representing the expiration time of the token
 * @returns a signed refresh token
 */
const signRefreshToken = (user, exp) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: exp }
    )
}

/**
 * Authorizes a user using an access token
 * 
 * @param { Request } req a request object
 * @param { Response } res a response object
 * @param { NextFunction } next a next function
 * @returns a response to the user with any errors or information OR calls the next function
 */
const authorize = (req, res, next) => {
    // grab the access token from the request
    const token = req.headers.authorization.split(' ')[1]

    // check if a token was provided
    if (!token)
        // if no token was provided, return a response containing an error
        return res.status(400).json({
            message: 'No token provided',
            error: 'NoTokenProvidedException'
        })

    // verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // if there was an error, return a response containing an error
        if (err)
            return res.status(401).json({
                message: 'Unauthorized token',
                error: 'UnauthorizedTokenException'
            })

        // if there was no error, assign the user to the request object
        req.user = {
            id: user.id,
            username: user.username
        }

        // call the next function
        next()
    })
}

/**
 * Verifies a refresh token
 * IF VALID assigns a new access token to the user
 * IF NOT VALID returns a response to the user with any errors or information
 * 
 * @param { Request } req a request object
 * @param { Response } res a response object
 * @param { NextFunction } next a next function
 * @returns a response to the user with any errors or information OR calls the next function
 */
const refresh = (req, res, next) => {
    // grab the refresh token from the request
    const refreshToken = req.cookies.refreshToken

    // check if a refresh token was provided
    if (!refreshToken)
        // if no refresh token was provided, return a response containing an error
        return res.status(400).json({
            message: 'No refresh token provided',
            error: 'NoRefreshTokenProvidedException'
        })

    // verify the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {

        // if there was an error, return a response containing an error
        if (err)
            return res.status(403).json({
                message: 'Unauthorized refresh token',
                error: 'UnauthorizedRefreshTokenException'
            })

        // if there was no error, assign the user to the request object
        req.user = {
            id: user.id,
            username: user.username
        }

        // call the next function
        next()
    })
}

// exports
const authorization = {
    signAccessToken,
    signRefreshToken,
    authorize,
    refresh
}

module.exports = authorization

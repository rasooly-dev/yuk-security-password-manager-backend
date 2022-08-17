const express = require('express')
const router = express.Router()

const authentication = require('../Authentication/authentication')
const authorization = require('../Authorization/authorization')

// USED FOR TESTING ONLY - DO NOT USE
// router.get('/users', async (req, res) => {
//     const users = await authentication.getUsers()

//     res.json(users)
// })

/**
 * API Route which handles registering a 
 * user into the service/database
 * 
 * Required parameters:
 *  *email - email address of the user
 *  *username - username of the user
 *  *password - password of the user
 * 
 * Response:
 * 
 * 201 - User successfully registered
 * 400 - Registration failed due to invalid parameters
 * 500 - Registration failed due to internal server error
 * 
 *  *message - message indicating success or failure of the request
 *  ^error - error message if the request failed
 * 
 */
router.post('/register', async (req, res) => {
    // create a user using information 
    // extracted from the request
    const user = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }

    // try-catch block to handle any exceptions
    try {

        // register the user
        await authentication.addUser(user)

        // return a success response
        res.status(201).json({
            message: 'User created'
        })
    }
    catch (err) {
        // return a failure response
        res.status(400).json({
            message: err.message,
            error: err.name
        })
    }

})

/**
 * API Route which handles logging in a
 * user into the service by checking the credentials
 * and returning a JWT token if the credentials are valid
 * 
 * Required parameters:
 *  *username - username of the user
 *  *password - password of the user
 * 
 * Response:
 * 
 * 200 - User successfully logged in
 * 400 - Login failed due to invalid parameters
 * 401 - Login failed due to invalid credentials
 * 500 - Login failed due to internal server error
 * 
 *  *message - message indicating success or failure of the request
 *  ^error - error message if the request failed
 *  ^access token - JWT access token if the request was successful
 *  ^refresh token - JWT refresh token if the request was successful
 * 
 */
router.post('/login', async (req, res) => {
    try {
        // grab the username and password from the request body
        const user = {
            username: req.body.username,
            password: req.body.password
        }

        // attempt to login the user
        const auth = await authentication.authenticateUser(user)

        // if the login check was invalid
        // return a failure response
        if (!auth.check)
            return res.status(401).json({
                message: 'Invalid credentials',
                error: 'InvalidCredentialsException'
            })

        // if the login check was valid

        // create a JWT access token for the user
        const accessToken = await authorization.signAccessToken({
            id: auth.user.id,
            username: auth.user.username
        }, '5m')

        // create a JWT refresh token for the user
        const refreshToken = await authorization.signRefreshToken({
            id: auth.user.id,
            username: auth.user.username
        }, '1h')

        // return a success response
        res.status(200).json({
            message: 'User authenticated',
            accessToken,
            refreshToken
        })
    }

    catch (err) {

        // return a failure response
        // if no user was found with the given credentials
        if (err.name === 'NoSuchUserException')
            return res.status(401).json({
                message: 'Invalid credentials',
                error: 'InvalidCredentialsException'
            })

        // return a server error response if the login check failed
        res.status(500).json({
            message: err.message,
            error: err.name
        })
    }

})

/**
 * API Route which handles refreshing a
 * user's access token by checking the refresh token
 * and returning a new access token if the refresh token is valid
 * 
 * Required parameters:
 * *refreshToken - refresh token of the user
 * 
 * Middleware:
 * *authorization - middleware to check the refresh token
 * 
 * Response:
 * 
 * 200 - User successfully refreshed their access token
 * 400 - Refresh failed due to invalid parameters
 * 401 - Refresh failed due to invalid refresh token
 * 500 - Refresh failed due to internal server error
 * 
 * *message - message indicating success or failure of the request
 * ^error - error message if the request failed
 * ^access token - JWT access token if the request was successful
 * 
 */
router.post('/refresh', authorization.refresh, async (req, res) => {

    // create a JWT access token for the user
    const accessToken = await authorization.signAccessToken({
        id: req.user.id,
        username: req.user.username
    }, '5m')

    // return a success response
    // with the new access token
    res.status(200).json({
        message: 'Token refreshed',
        accessToken
    })
})

module.exports = router

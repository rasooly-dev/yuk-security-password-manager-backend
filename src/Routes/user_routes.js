const express = require('express')
const router = express.Router()

const authorization = require('../Authorization/authorization')

/**
 * API Route which handles retrieving
 * the user's data from the service/database
 * 
 * Required parameters:
 * *access_token - access token of the user
 * 
 * Middleware:
 * *authorization - authorization middleware to verify the user's access token
 * 
 * Response:
 * 
 * 200 - User data successfully retrieved
 * 400 - Retrieval failed due to invalid parameters
 * 500 - Retrieval failed due to internal server error
 * 
 * *message - message indicating success or failure of the request
 * ^error - error message if the request failed
 * 
 * ^user - user object containing the user's data
 *        if the request was successful
 * 
 */
router.get('/', authorization.authorize, (req, res) => {

    // return a success response
    res.status(200).json({
        message: 'User data successfully retrieved',
        user: req.user
    })
})

module.exports = router
const express = require('express')
const app = express()

app.use(express.json())

const account_utils = require('../Accounts/accounts')
const authorization = require('../Authorization/authorization')

const PORT = 3500

/**
 * API Route which handles updating
 * the user's accounts in the service/database
 * 
 * Required parameters:
 * *access_token - access token of the user
 * *accounts - encrypted string containing the user's accounts
 * 
 * Middleware:
 * *authorization - authorization middleware to verify the user's access token
 * 
 * Response:
 * 
 * 200 - User's accounts successfully updated
 * 400 - Update failed due to invalid parameters
 * 500 - Update failed due to internal server error
 * 
 * *message - message indicating success or failure of the request
 * ^error - error message if the request failed
 * 
 */
app.post('/accounts/update', authorization.authorize, async (req, res) => {
    // extract the user's encrypted accounts
    // from the request body
    const accounts = req.body.accounts
    const user = req.user

    try {

        // update the user's accounts
        await account_utils.storeAccounts(user, accounts)

        // return a success response
        res.status(200).json({
            message: 'Accounts updated'
        })
    }
    catch (err) {

        // if no accounts are provided
        if (err.name === 'NoAccountsProvidedException')
            // return a failure response
            return res.status(400).json({
                message: err.message,
                error: err.name
            })

        // return a failure response
        // for any other exception
        return res.status(500).json({
            message: err.message,
            error: err.name
        })
    }
})

/**
 * API Route which handles retrieving
 * the user's accounts from the service/database
 * 
 * Required parameters:
 * *access_token - access token of the user
 * 
 * Middleware:
 * *authorization - authorization middleware to verify the user's access token
 * 
 * Response:
 * 
 * 200 - User's accounts successfully retrieved
 * 400 - Retrieve failed due to invalid parameters
 * 500 - Retrieve failed due to internal server error
 * 
 * *message - message indicating success or failure of the request
 * ^error - error message if the request failed
 * 
 * ^accounts - encrypted string containing the user's accounts
 *             if the request was successful
 * 
 */
app.get('/accounts', authorization.authorize, async (req, res) => {

    const user = req.user

    try {
        // retrieve the user's accounts from the database
        const accounts = await account_utils.getAccounts(user)

        // return a success response
        return res.status(200).json({
            message: 'Accounts successfully retrieved',
            accounts: accounts
        })

    } catch (err) {

        // return a failure response
        // if any error occurs while retrieving the accounts
        return res.status(500).json({
            message: err.message,
            error: err.name
        })
    }
})

// start the server on the specified port
app.listen(PORT)
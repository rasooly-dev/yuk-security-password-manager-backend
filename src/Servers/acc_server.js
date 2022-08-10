const express = require('express')
const app = express()

app.use(express.json())

const account_utils = require('../Accounts/accounts')
const authorization = require('../Authorization/authorization')

app.post('/accounts/update', authorization.authorize, async (req, res) => {
    const accounts = req.body.accounts
    const user = req.user

    try {
        await account_utils.storeAccounts(user, accounts)
        res.status(200).json({
            message: 'Accounts updated'
        })
    }
    catch (err) {

        if (err.name === 'NoAccountsProvidedException')
            return res.status(400).json({
                message: err.message,
                error: err.name
            })

        res.status(500).json({
            message: err.message,
            error: err.name
        })
    }
})

app.get('/accounts', authorization.authorize, async (req, res) => {

    const user = req.user

    try {
        const accounts = await account_utils.getAccounts(user)

        res.status(200).json({
            message: 'Accounts successfully retrieved',
            accounts: accounts
        })
        
    } catch (err) {
        res.status(500).json({
            message: err.message,
            error: err.name
        })
    }
})


app.listen(3500)
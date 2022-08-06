const express = require('express')
const app = express()

const authentication = require('../Authentication/authentication')
const authorization = require('../Authorization/authorization')

app.use(express.json())

app.get('/auth/users', async (req, res) => {
    const users = await authentication.getUsers()

    res.json(users)
})


app.post('/auth/register', async (req, res) => {
    const user = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }

    try {
        await authentication.addUser(user)
        res.status(201).json({
            message: 'User created'
        })
    }
    catch (err) {
        res.status(400).json({
            message: err.message,
            error: err.name
        })
    }

})

app.post('/auth/login', async (req, res) => {
    try {
        const user = {
            username: req.body.username,
            password: req.body.password
        }

        const auth = await authentication.authenticateUser(user)

        if (!auth.check)
            return res.status(401).json({
                message: 'Invalid credentials',
                error: 'InvalidCredentialsException'
            })
        
        console.log(auth)

        const accessToken = await authorization.signAccessToken({
            id : auth.user.id,
            username : auth.user.username
        }, '5m')

        const refreshToken = await authorization.signRefreshToken({
            id : auth.user.id,
            username : auth.user.username
        }, '1h')

        res.status(200).json({
            message: 'User authenticated',
            accessToken,
            refreshToken
        })
    }

    catch (err) {

        if (err.name === 'NoSuchUserException')
            return res.status(401).json({
                message: 'Invalid credentials',
                error: 'InvalidCredentialsException'
            })

        res.status(500).json({
            message: err.message,
            error: err.name
        })
    }

}) 

app.post('/auth/refresh', authorization.refresh, async (req, res) => {
    // TODO: implement refresh token logic

    const accessToken = await authorization.signAccessToken({
        id : req.user.id,
        username : req.user.username
    }, '5m')

    res.status(200).json({
        message: 'Token refreshed',
        accessToken
    })
})


app.listen(3000)

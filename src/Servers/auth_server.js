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
        res.status(201).send("user added")
    }
    catch (err) {
        res.status(400).send(err.message)
    }

})

app.post('/auth/login', async (req, res) => {
    try {
        const user = {
            username: req.body.username,
            password: req.body.password
        }

        const auth = await authentication.authenticateUser(user)

        if (!auth)
            return res.status(401).send("user not authenticated")

        const accessToken = await authorization.signAccessToken({
            id : auth.id,
            username : auth.username
        })

        const refreshToken = await authorization.signRefreshToken({
            id : auth.id,
            username : auth.username
        })

        res.status(200).json({
            accessToken,
            refreshToken
        })
    }
    catch (err) {
        res.status(500).send(err.message)
    }

}) 

app.post('/auth/refresh', async (req, res) => {
    // TODO: implement refresh token logic
    res.status(200).send("refresh token")
})


app.listen(3000)

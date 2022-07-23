const express = require('express')
const app = express()

const authentication = require('../Authentication/authentication')

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

        if (await authentication.authenticateUser(user))
            res.status(200).send("user authenticated")
        else
            res.status(401).send("user not authenticated")
    }
    catch (err) {
        res.status(500).send(err.message)
    }

}) 


app.listen(3000)

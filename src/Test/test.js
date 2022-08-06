require('dotenv').config('../../.env')

const authorization = require('../Authorization/authorization')

const express = require('express')
const app = express()

port = 4000


app.get('/test', authorization.authorize, (req, res) => {
    res.send('Hello World!')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



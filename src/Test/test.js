require('dotenv').config('../../.env')

const authorization = require('../Authorization/authorization')

const express = require('express')
const app = express()

const PORT = 4000


app.get('/test', authorization.authorize, (req, res) => {
    res.send('Hello World!')
})


app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})



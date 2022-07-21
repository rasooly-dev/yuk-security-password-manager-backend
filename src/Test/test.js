require('dotenv').config('../../.env')

const express = require('express')
const app = express()

port = 4000


app.get('/test', (req, res) => {
    res.send('Hello World!')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



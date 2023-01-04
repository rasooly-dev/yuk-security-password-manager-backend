const express = require('express')
const app = express()

const auth_routes = require('../Routes/auth_routes')
const acc_routes = require('../Routes/acc_routes')
const user_routes = require('../Routes/user_routes')

const cookieParser = require('cookie-parser')

const cors = require("cors");

const corsOptions = {
   origin: '*',
   credentials: true,            //access-control-allow-credentials:true
   optionSuccessStatus: 200
}

app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', auth_routes)
app.use('/api/accounts', acc_routes)
app.use('/api/user', user_routes)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server started on port ${process.env.PORT || 5000}`)
})
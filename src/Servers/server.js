const express = require('express')
const app = express()

const auth_routes = require('../Routes/auth_routes')
const acc_routes = require('../Routes/acc_routes')

const cors=require("cors");
const corsOptions ={
   origin:'http://localhost:3000',
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200
}

app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(express.json())

app.use('/api/auth', auth_routes)
app.use('/api/accounts', acc_routes)

app.listen(4000, () => {
    console.log('Server started on port 4000')
})
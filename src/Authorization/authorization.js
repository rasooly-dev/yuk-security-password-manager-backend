require('dotenv').config('../../.env')

const jwt = require('jsonwebtoken')


const signAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: '15s' }
    )
}

const signRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
}

const authorize = (req, res, next) => {
    const token = req.headers.authorization
    token = token.split(' ')[1]

    if (!token) 
        return res.status(401).send('No token provided')
    

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) 
            return res.status(403).send('Unauthorized')
        req.user = user
        next()
    })
}





const authorization = {
    signAccessToken,
    signRefreshToken,
    authorize
}

module.exports = authorization

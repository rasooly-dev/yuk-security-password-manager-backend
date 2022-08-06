require('dotenv').config('../../.env')

const jwt = require('jsonwebtoken')


const signAccessToken = (user, exp) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: exp }
    )
}

const signRefreshToken = (user, exp) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: exp }
    )
}

const authorize = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]

    if (!token) 
        return res.status(401).json({
            message: 'No token provided',
            error: 'NoTokenProvidedException'
        })
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) 
            return res.status(401).json({
                message: 'Unauthorized token',
                error: 'UnauthorizedTokenException'
            })

        req.user = user
        next()
    })
}

const refresh = (req, res, next) => {
    const refreshToken = req.body.refreshToken

    if (!refreshToken)
        return res.status(400).json({
            message: 'No refresh token provided',
            error: 'NoRefreshTokenProvidedException'
        })

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.status(403).json({
                message: 'Unauthorized refresh token',
                error: 'UnauthorizedRefreshTokenException'
            })

        req.user = user
        next()
    })
}





const authorization = {
    signAccessToken,
    signRefreshToken,
    authorize,
    refresh
}

module.exports = authorization

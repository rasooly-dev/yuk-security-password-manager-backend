require('dotenv').config('../../.env')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const database = require('../utils/database')

/**
 * Generates a register token for a user which expires in 5 minutes
 * 
 * @param { Object } user an object holding the user's email and username and hashed password
 * @returns a register token for the user
 */
const generateAddUserToken = async (user) => {
        // grab user information from the user object
        const { email, username, password } = user

        // hash the given password
        const hashedPassword = await hashPassword(password)

        // query a check of an existing user 
        // with the given username or email exists
        const duplicateUserQuery = await database.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email])

        // check if a user with the given username 
        // already exists
        if (duplicateUserQuery.rowCount != 0)
            // if a user with the given username already 
            // exists, throw an exception
            throw new UserAlreadyExistsException('Username or email already exists')
        
        // generate a random Token
        const token = jwt.sign({ email, username, password: hashedPassword }, process.env.REGISTER_VERIFY_KEY, { expiresIn: '5m' })

        // return the token
        return token

}

/**
 * Validates a register token for a user
 * 
 * @param { JSON-Web-Token } token a JSON-Web-Token generated by the generateRegisterToken function containing the user's email, username, and hashed password
 * 
 * @returns the user's email, username, and hashed password if the token is valid
 * 
 * @throws an exception if the token is invalid
 */
const verifyAddUserToken = async (token) => {
    // verify the token
    return jwt.verify(token, process.env.REGISTER_VERIFY_KEY, (err, decoded) => {
        // if the token is invalid, throw an exception
        if (err)
            throw new InvalidRegisterTokenException('Invalid Register Token: This token is either expired or invalid')
        
        // return the user's email, username, and hashed password
        return decoded
    })
}


/**
 * Adds a user to the database
 * 
 * @param { Object } user an object holding the user's email, username, and password
 */
const addUser = async (user) => {

    // grab user information from the user object
    const { email, username, password } = user

    const duplicateUserQuery = await database.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email])

    // check if a user with the given username already exists
    if (duplicateUserQuery.rowCount != 0)
        // if a user with the given username already exists, throw an exception
        throw new UserAlreadyExistsException('Username or email already exists')

    // insert the user into the database
    return await database.insert('users', { email, username, password, accounts: "" })
}

/**
 * Removes a user from the database
 * 
 * @param { Object } user an object holding the user's email & username
 */
const removeUser = async (user) => {
    // grab the users email and username
    const {email, username} = user

    // remove the user from the database
    await database.remove('users', {email, username})
}

/**
 * Authenticates a user
 * 
 * @param { Object } reqUser an object holding the user's username and password
 * @returns object containing the user id and username and if a user passed the check
 */
const authenticateUser = async (reqUser) => {
    // grab the user's username
    const username = reqUser.username

    // try grabbing the user from the database
    const user = 
    await database.query('SELECT * FROM users WHERE username = $1', [username])
    .then(res => { 
        return res.rows[0] 
    })
    .catch(err => {
        console.log(err)
        throw new err
    })

    // if no user with the given username exists, throw an exception
    if (!user) {
        throw new NoSuchUserException(`No user with username ${username}`)
    }

    // compare the given password to the hashed password in the database
    const check = await comparePassword(reqUser.password, user.password)

    // let a variable hold the user's id and username
    let retUser = {
        id: user.id,
        username: user.username,
    }
    
    // if the password doesn't match the hashed password
    // set the previous variable to null
    if (!check) retUser = null

    // return the user and if the user passed the check
    return {
        check,
        user: retUser
    }
}

// Method to get all users - DO NOT USE
// const getUsers = async () => {
//     const res = await database.query('SELECT * FROM users')
//     return res.rows
// }

// bcrypt stuff

/**
 * Hashes a given password
 * 
 * @param { String } password the password to be hashed
 * @returns a hashed password
 */
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
}

/**
 * Compares a given password to a hashed password
 * 
 * @param { String } password 
 * @param { String } hashedPassword 
 * @returns a boolean indicating if the password matches the hashed password
 */
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}


// exceptions

/**
 * An exception thrown when a register token is invalid
 * 
 * @param { String } message 
 */
 function InvalidRegisterTokenException(message) {
    this.message = message
    this.name = 'InvalidRegisterTokenException'
}

/**
 * An exception thrown when no user with the given information exists
 * 
 * @param { String } message 
 */
function NoSuchUserException(message) {
    this.message = message
    this.name = 'NoSuchUserException'
}

/**
 * An exception thrown when a user with the given information already exists
 * 
 * @param { String } message 
 */
function UserAlreadyExistsException(message) {
    this.message = message
    this.name = 'UserAlreadyExistsException'
}

// exports

authentication = {
    generateAddUserToken,
    verifyAddUserToken,
    addUser,
    removeUser,
    authenticateUser
}

module.exports = authentication

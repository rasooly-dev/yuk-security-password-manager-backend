const bcrypt = require('bcrypt')

const database = require('../utils/database')

const addUser = async (user) => {

    const { email, username, password } = user
    const hashedPassword = await hashPassword(password)

    if (await database.query('SELECT * FROM users WHERE username = $1', [username])) {
        throw new UserAlreadyExistsException('Username already exists')
    }

    await database.insert('users', { email, username, password: hashedPassword, accounts: "" })
}

const removeUser = async (user) => {
    const {email, username} = user

    await database.remove('users', {email, username})
}

const authenticateUser = async (reqUser) => {
    const username = reqUser.username

    const user = 
    await database.query('SELECT * FROM users WHERE username = $1', [username])
    .then(res => { 
        return res.rows[0] 
    })
    .catch(err => {
        console.log(err)
        throw new err
    })

    if (!user) {
        throw new NoSuchUserException(`No user with username ${username}`)
    }

    const check = await comparePassword(reqUser.password, user.password)
    
    let retUser = {
        id: user.id,
        username: user.username,
    }
    
    if (!check) retUser = null

    return {
        check,
        user: retUser
    }


}

const getUsers = async () => {
    const res = await database.query('SELECT * FROM users')
    return res.rows
}


// bcrypt stuff

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
}

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}


// exceptions

function NoSuchUserException(message) {
    this.message = message
    this.name = 'NoSuchUserException'
}

function UserAlreadyExistsException(message) {
    this.message = message
    this.name = 'UserAlreadyExistsException'
}

// exports

authentication = {
    addUser,
    removeUser,
    authenticateUser,
    getUsers
}

module.exports = authentication

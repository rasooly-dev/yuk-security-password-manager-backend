const bcrypt = require('bcrypt')

const users = []

const addUser = async (user) => {

    const { username, password } = user

    const hashedPassword = await hashPassword(password)

    users.push({
        username,
        password: hashedPassword
    })
}

const removeUser = (user) => {
    const username = user.username

    const index = users.findIndex(user => user.username === username)

    users.splice(index, 1)
}

const authenticateUser = async (reqUser) => {
    const username = reqUser.username

    const user = users.find(user => user.username === username)

    if (user == null) throw new NoSuchUserException(username)

    return await comparePassword(reqUser.password, user.password)


}

const getUsers = () => {
    return users
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

// exports

authentication = {
    addUser,
    removeUser,
    authenticateUser,
    getUsers
}

module.exports = authentication

require('dotenv').config('../../.env')
const aes256 = require('aes256')

const database = require('../utils/database')

const storeAccounts = async (user, accounts) => {
    const { id } = user

    if (accounts === "") 
        return await database.update('users', { accounts: accounts }, { id })

    let accounts_to_store = encrypt(accounts)
    return await database.update('users', { accounts: accounts_to_store }, { id })
}

const getAccounts = async (user) => {
    const { id } = user

    const user_accounts = await database.query('SELECT accounts FROM users WHERE id = $1', [id])
    const accounts = decrypt(user_accounts.rows[0].accounts)

    return accounts
}


const encrypt = (accountText) => {
    return aes256.encrypt(process.env.ACCOUNT_SECRET, accountText)
}

const decrypt = (accountText) => {
    return aes256.decrypt(process.env.ACCOUNT_SECRET, accountText)
}

module.exports = {
    storeAccounts,
    getAccounts
}
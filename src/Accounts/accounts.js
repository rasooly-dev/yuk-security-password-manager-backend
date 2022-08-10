require('dotenv').config('../../.env')
const aes256 = require('aes256')

const database = require('../utils/database')


// methods

const storeAccounts = async (user, accounts) => {
    const { id } = user

    if (accounts === undefined || accounts === null) 
        throw new NoAccountsProvidedException('No accounts provided')

    if (accounts === "") 
        return await database.update('users', { accounts: accounts }, { id })

    let accounts_to_store = encrypt(accounts)
    return await database.update('users', { accounts: accounts_to_store }, { id })
}

const getAccounts = async (user) => {
    const { id } = user

    const user_accounts = await database.query('SELECT accounts FROM users WHERE id = $1', [id])

    if (user_accounts.rows[0].accounts === "") 
        return ""

    const accounts = decrypt(user_accounts.rows[0].accounts)


    return accounts
}


// utils

const encrypt = (accountText) => {
    return aes256.encrypt(process.env.ACCOUNT_COMPANY_SECRET, accountText)
}

const decrypt = (accountText) => {
    return aes256.decrypt(process.env.ACCOUNT_COMPANY_SECRET, accountText)
}

const test = async () => {
    await storeAccounts({ id: 2 }, "accounts_test")
    console.log(await getAccounts({id: 2}))
}


// exceptions

function NoAccountsProvidedException (message) {
    this.message = message
    this.name = 'NoAccountsProvidedException'
}

// exports

module.exports = {
    storeAccounts,
    getAccounts,
    test
}
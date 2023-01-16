require('dotenv').config('../../.env')
const aes256 = require('aes256')

const database = require('../utils/database')


// methods

/**
 * Stores the accounts of a user in the database
 * 
 * @param {Object} user an object holding the user's id and username
 * @param {String} accounts an encrypted string of the user's accounts
 * @returns database related callback
 * 
 * @throws {NoAccountsProvidedException} if no accounts were provided
 */
const storeAccounts = async (user, accounts) => {
    // grab the user's id
    const { id } = user

    // if no accounts were provided, throw an exception
    if (accounts === undefined || accounts === null || accounts === '') 
        throw new NoAccountsProvidedException('No accounts provided')

    // otherwise, encrypt the account string and update the database
    let accounts_to_store = encrypt(JSON.stringify(accounts))
    return await database.query('UPDATE users SET accounts = $1 WHERE id = $2', [accounts_to_store, id])
}

/**
 * Gets the accounts of a user from the database
 * 
 * @param {Object} user an object holding the user's id and username
 * @returns accounts of the user
 */
const getAccounts = async (user) => {
    // grab the user's id
    const { id } = user

    // get the user's accounts from the database
    const user_accounts = await database.query('SELECT accounts FROM users WHERE id = $1', [id])

    // if the user has no accounts, return an empty string
    if (user_accounts.rows[0].accounts === "") 
        return {}

    // otherwise, decrypt the user's accounts and return them
    const accounts = JSON.parse(decrypt(user_accounts.rows[0].accounts))
    return accounts
}


// utils

/**
 * Encrypts the accounts string with the company secret
 * 
 * @param {String} accountText string containing the accounts to encrypt
 * @returns encrypted string using the company secret
 */
const encrypt = (accountText) => {
    // encrypt the account string with the company secret and return it
    return aes256.encrypt(process.env.ACCOUNT_COMPANY_SECRET, accountText)
}

/**
 * Decrypts the accounts string with the company secret
 * 
 * @param {String} accountText an encrypted string containing the accounts to decrypt
 * @returns decrypted string using the company secret
 */
const decrypt = (accountText) => {
    // decrypt the account string with the company secret and return it
    return aes256.decrypt(process.env.ACCOUNT_COMPANY_SECRET, accountText)
}

// TEST METHOD - DO NOT USE
// const test = async () => {
//     await storeAccounts({ id: 2 }, "accounts_test")
//     console.log(await getAccounts({id: 2}))
// }


// exceptions

/**
 * Exception thrown when no accounts were provided
 * 
 * @param { String } message message to be displayed when the exception is thrown
 */
function NoAccountsProvidedException (message) {
    this.message = message
    this.name = 'NoAccountsProvidedException'
}

// exports
module.exports = {
    storeAccounts,
    getAccounts
}
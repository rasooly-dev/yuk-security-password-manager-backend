require("dotenv").config('../../.env')

const { Client } = require('pg')


/**
 * Executes a query on the database
 * 
 * @param { String } query a string representing the SQL query to be executed
 * @param { Array } params a list of parameters to be passed to the query
 * @returns 
 */
const query = async (query, params = []) => {
    // create a new client
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    })
    // connect to the database
    await client.connect()

    // execute the query
    // if the query is valid return the result
    // otherwise return an error
    return client
        .query(query, params)
        .then(res => {
            client.end()
            return res
        })
        .catch(err => {
            client.end()
        });
}

/**
 * Inserts given values into a table
 * 
 * @param { String } table a string representing the table to insert into
 * @param { Object } values an object holding the values to insert
 */
const insert = async (table, values) => {
    // get the keys & values of the values object
    // into separate arrays
    let keys = Object.keys(values)
    let vals = Object.values(values)

    // create a string of the keys and values to insert
    let keys_str = keys.join(',')
    
    let vals_str = ''
    for (let i = 1; i <= vals.length; i++) {
        vals_str += '$' + i

        if (i < vals.length) 
            vals_str += ', '
        
    }


    // create the query
    let q = `INSERT INTO ${table} (${keys_str}) VALUES (${vals_str})`

    // execute the query
    await query(q, vals)
}

/**
 * Updates a table with given values
 * 
 * @param { String } table a string representing the table to update
 * @param { Object } values an object holding the values to update
 * @param { Object } conditions an object holding the conditions to update the values with
 */
const update = async (table, values, conditions) => {
    // get the keys & values of the values object
    let keys = Object.keys(values)
    let vals = Object.values(values)

    // create a string of the keys and values to update
    let keys_str = keys.map(key => `${key} = '${vals[keys.indexOf(key)]}'`).join(',')
    // create a string of the conditions to update the values with
    let cond_str = Object.keys(conditions).map(key => `${key} = '${conditions[key]}'`).join(' AND ')

    // create the query
    let q = `UPDATE ${table} SET ${keys_str} WHERE $3`
    
    // execute the query
    await query(q, cond_str)
}

/**
 * Removes a specific row from a table
 * 
 * @param { String } table the table to remove the row from
 * @param { Object } conditions an object holding the conditions to remove the row with
 */
const remove = async (table, conditions) => {

    // create a string of the conditions to remove the row with
    // the keys and values of the conditions object
    let cond_str = Object.keys(conditions).map(key => `${key} = '${conditions[key]}'`).join(' AND ')

    // create the query
    let q = `DELETE FROM ${table} WHERE $2`

    // execute the query
    await query(q, cond_str)
}


db_utils = {
    query,
    insert,
    update,
    remove
}

module.exports = db_utils
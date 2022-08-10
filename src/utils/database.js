require("dotenv").config('../../.env')

const { Client } = require('pg')


const query = async (query, params = []) => {
    const client = new Client()
    await client.connect()

    return client
        .query(query, params)
        .then(res => {
            client.end()
            return res
        })
        .catch(err => {
            client.end()
            console.log(err)
        });
}

const insert = async (table, values) => {
    let keys = Object.keys(values)
    let vals = Object.values(values)

    console.log(keys, vals)

    let keys_str = keys.join(',')
    let vals_str = vals.map(val => `'${val}'`).join(',')

    let q = `INSERT INTO ${table} (${keys_str}) VALUES (${vals_str})`
    await query(q)
}

const update = async (table, values, conditions) => {
    let keys = Object.keys(values)
    let vals = Object.values(values)

    let keys_str = keys.map(key => `${key} = '${vals[keys.indexOf(key)]}'`).join(',')
    let cond_str = Object.keys(conditions).map(key => `${key} = '${conditions[key]}'`).join(' AND ')

    let q = `UPDATE ${table} SET ${keys_str} WHERE ${cond_str}`
    await query(q)
}


const remove = async (table, conditions) => {

    let cond_str = Object.keys(conditions).map(key => `${key} = '${conditions[key]}'`).join(' AND ')

    let q = `DELETE FROM ${table} WHERE ${cond_str}`
    await query(q)
}


db_utils = {
    query,
    insert,
    update,
    remove
}

module.exports = db_utils
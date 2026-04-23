const oracledb = require('oracledb');
require('dotenv').config();

// Connection pool — reuses connections instead of creating a new one 
// for every single request (much faster)
async function initializePool() {
    try {
        await oracledb.createPool({
            user:             process.env.DB_USER,
            password:         process.env.DB_PASSWORD,
            connectString:    process.env.DB_CONNECTION,
            poolMin:          2,
            poolMax:          10,
            poolIncrement:    1
        });
        console.log('Oracle connection pool created successfully');
    } catch (error) {
        console.error('Error creating Oracle connection pool:', error);
        throw error;
    }
}

// Call this function whenever you need a database connection
async function getConnection() {
    return await oracledb.getConnection();
}

// Call this to close a connection after you're done with it
async function closeConnection(connection) {
    if (connection) {
        try {
            await connection.close();
        } catch (error) {
            console.error('Error closing connection:', error);
        }
    }
}

module.exports = { initializePool, getConnection, closeConnection };
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Maak een connection pool aan voor betere performance
// Bron: https://github.com/sidorares/node-mysql2#using-connection-pools
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Gebruik promises voor async/await syntax
const promisePool = pool.promise();

// Test de database connectie
export const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✓ Database connectie succesvol');
        connection.release();
        return true;
    } catch (error) {
        console.error('✗ Database connectie mislukt:', error.message);
        return false;
    }
};

export default promisePool;

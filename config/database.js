import mysql from 'mysql2';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

/**
 * MySQL database connection pool configuratie
 * 
 * Connection pooling wordt gebruikt voor betere performance en resource management.
 * De pool hergebruikt database connecties in plaats van nieuwe connecties per query.
 * 
 * SSL support is geïmplementeerd voor beveiligde cloud database connecties.
 * 
 * Bronnen:
 * - Connection pooling: https://github.com/sidorares/node-mysql2#using-connection-pools
 * - SSL configuratie: https://dev.mysql.com/doc/refman/8.0/en/using-encrypted-connections.html
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME || process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // SSL configuratie voor cloud databases zoals Aiven
    // Bron: https://dev.mysql.com/doc/refman/8.0/en/using-encrypted-connections.html
    ssl: process.env.DB_SSL_CA ? {
        ca: fs.readFileSync(process.env.DB_SSL_CA)
    } : undefined
});

// Promise wrapper voor async/await syntax
const promisePool = pool.promise();

/**
 * Test de database connectie bij het opstarten van de server
 * @returns {Promise<boolean>} True als connectie succesvol, false bij fout
 */
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

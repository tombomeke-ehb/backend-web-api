import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// SQLite database connectie (async/await compatible)
const dbPromise = open({
  filename: './dev.sqlite3',
  driver: sqlite3.Database
});

export default dbPromise;

export const testConnection = async () => {
  try {
    const db = await dbPromise;
    await db.get('SELECT 1');
    console.log('✓ SQLite connectie succesvol');
    return true;
  } catch (error) {
    console.error('✗ SQLite connectie mislukt:', error.message);
    return false;
  }
};

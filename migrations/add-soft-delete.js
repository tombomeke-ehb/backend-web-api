/**
 * Migration: Add Soft Delete
 * 
 * Voegt een deleted_at kolom toe aan recipes en categories tabellen
 * voor soft delete functionaliteit (data behouden maar als verwijderd markeren)
 * 
 * Gebruik: node migrations/add-soft-delete.js
 * 
 * @author Backend Web API Project - EHB 2026
 */

import db from '../config/database.js';

// Helper functie om te checken of een kolom bestaat
async function columnExists(table, column) {
    const [rows] = await db.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = ? 
          AND COLUMN_NAME = ?
    `, [table, column]);
    return rows.length > 0;
}

// Helper functie om te checken of een index bestaat
async function indexExists(table, indexName) {
    const [rows] = await db.query(`
        SELECT INDEX_NAME 
        FROM INFORMATION_SCHEMA.STATISTICS 
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = ? 
          AND INDEX_NAME = ?
    `, [table, indexName]);
    return rows.length > 0;
}

async function migrate() {
    console.log('🔄 Starting soft delete migration...\n');
    
    try {
        // Voeg deleted_at kolom toe aan recipes
        console.log('Checking recipes table...');
        if (await columnExists('recipes', 'deleted_at')) {
            console.log('   ✓ Column deleted_at already exists');
        } else {
            console.log('   Adding deleted_at column...');
            await db.query(`ALTER TABLE recipes ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL`);
            console.log('   ✓ Column added');
        }
        
        // Voeg deleted_at kolom toe aan categories
        console.log('Checking categories table...');
        if (await columnExists('categories', 'deleted_at')) {
            console.log('   ✓ Column deleted_at already exists');
        } else {
            console.log('   Adding deleted_at column...');
            await db.query(`ALTER TABLE categories ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL`);
            console.log('   ✓ Column added');
        }
        
        // Voeg index toe voor betere query performance
        console.log('Checking indexes...');
        
        if (await indexExists('recipes', 'idx_recipes_deleted_at')) {
            console.log('   ✓ Index idx_recipes_deleted_at already exists');
        } else {
            console.log('   Adding index to recipes...');
            await db.query(`CREATE INDEX idx_recipes_deleted_at ON recipes(deleted_at)`);
            console.log('   ✓ Index added');
        }
        
        if (await indexExists('categories', 'idx_categories_deleted_at')) {
            console.log('   ✓ Index idx_categories_deleted_at already exists');
        } else {
            console.log('   Adding index to categories...');
            await db.query(`CREATE INDEX idx_categories_deleted_at ON categories(deleted_at)`);
            console.log('   ✓ Index added');
        }
        
        console.log('\n✅ Migration completed successfully!');
        console.log('Soft delete is now available for recipes and categories.');
        console.log('\nNew endpoints:');
        console.log('  - DELETE /api/recipes/:id     - Soft delete a recipe');
        console.log('  - DELETE /api/categories/:id  - Soft delete a category');
        console.log('  - POST /api/recipes/:id/restore    - Restore a recipe');
        console.log('  - POST /api/categories/:id/restore - Restore a category');
        console.log('  - GET /api/recipes/deleted    - List deleted recipes');
        
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        process.exit(1);
    }
}

migrate();

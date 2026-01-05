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

async function migrate() {
    console.log('🔄 Starting soft delete migration...\n');
    
    try {
        // Voeg deleted_at kolom toe aan recipes
        console.log('Adding deleted_at to recipes table...');
        await db.query(`
            ALTER TABLE recipes 
            ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL
        `).catch(e => {
            if (!e.message.includes('Duplicate column')) throw e;
            console.log('   Column already exists, skipping...');
        });
        
        // Voeg deleted_at kolom toe aan categories
        console.log('Adding deleted_at to categories table...');
        await db.query(`
            ALTER TABLE categories 
            ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL
        `).catch(e => {
            if (!e.message.includes('Duplicate column')) throw e;
            console.log('   Column already exists, skipping...');
        });
        
        // Voeg index toe voor betere query performance
        console.log('Adding indexes for deleted_at columns...');
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_recipes_deleted_at ON recipes(deleted_at)
        `).catch(() => console.log('   Index may already exist, continuing...'));
        
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_categories_deleted_at ON categories(deleted_at)
        `).catch(() => console.log('   Index may already exist, continuing...'));
        
        console.log('\n✓ Migration completed successfully!');
        console.log('Soft delete is now available for recipes and categories.');
        
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        process.exit(1);
    }
}

migrate();

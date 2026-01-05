/**
 * Database Setup Script
 * 
 * Dit script maakt de benodigde database tabellen aan en vult ze met seed data
 * Kan veilig meerdere keren uitgevoerd worden (idempotent)
 * 
 * Gebruik: node setup-database.js
 * 
 * Database structuur:
 * - categories: Bevat recipe categorieën (Ontbijt, Lunch, Diner, etc.)
 * - recipes: Bevat recepten met foreign key naar categories
 */

import db from './config/database.js';

/**
 * Array van SQL statements die uitgevoerd moeten worden
 * Volgorde is belangrijk: eerst categories (parent), dan recipes (child)
 */
const sqlStatements = [
    // Categories tabel
    `CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    
    // Recipes tabel
    `CREATE TABLE IF NOT EXISTS recipes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        prep_time INT NOT NULL COMMENT 'Preparation time in minutes',
        cook_time INT NOT NULL COMMENT 'Cooking time in minutes',
        servings INT NOT NULL DEFAULT 1,
        difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
        category_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        INDEX idx_category (category_id),
        INDEX idx_difficulty (difficulty),
        INDEX idx_title (title)
    )`,
    
    // Voorbeeld categories
    `INSERT INTO categories (name, description) VALUES
        ('Ontbijt', 'Recepten voor een gezond ontbijt'),
        ('Lunch', 'Snelle en makkelijke lunch recepten'),
        ('Diner', 'Hoofdgerechten voor het avondeten'),
        ('Dessert', 'Zoete lekkernijen en nagerechten'),
        ('Vegetarisch', 'Vleesvije gerechten'),
        ('Vegan', 'Volledig plantaardig')
    ON DUPLICATE KEY UPDATE name=name`,
    
    // Voorbeeld recipes
    `INSERT INTO recipes (title, description, ingredients, instructions, prep_time, cook_time, servings, difficulty, category_id) VALUES
        ('Pannenkoeken', 'Heerlijke Nederlandse pannenkoeken', '250g bloem, 2 eieren, 500ml melk, snufje zout', '1. Mix alle ingrediënten tot een glad beslag. 2. Bak in een hete pan met boter. 3. Draai om na 2 minuten.', 10, 15, 4, 'easy', 1),
        ('Spaghetti Bolognese', 'Klassieke Italiaanse pasta', '400g spaghetti, 500g gehakt, 400g tomaten, ui, knoflook', '1. Bak het gehakt. 2. Voeg ui en knoflook toe. 3. Voeg tomaten toe en laat sudderen. 4. Kook de pasta.', 15, 30, 4, 'easy', 3),
        ('Caesar Salade', 'Frisse salade met kip', 'Romaine sla, kip, parmezaan, croutons, caesar dressing', '1. Gril de kip. 2. Snijd de sla. 3. Mix alles en voeg dressing toe.', 20, 10, 2, 'easy', 2)
    ON DUPLICATE KEY UPDATE title=title`
];

async function setupDatabase() {
    try {
        console.log('📦 Database setup starten...\n');
        
        // Voer elke SQL statement uit
        for (let i = 0; i < sqlStatements.length; i++) {
            const statement = sqlStatements[i];
            try {
                if (statement.includes('CREATE TABLE')) {
                    const match = statement.match(/CREATE TABLE[^`]*`?(\w+)`?/i);
                    if (match) {
                        console.log(`✓ Tabel '${match[1]}' aanmaken...`);
                    }
                } else if (statement.includes('INSERT')) {
                    console.log(`✓ Data invoegen...`);
                }
                
                await db.query(statement);
            } catch (error) {
                if (!error.message.includes('already exists')) {
                    console.error(`❌ Error:`, error.message);
                }
            }
        }
        
        console.log('\nDatabase setup voltooid.\n');
        
        // Toon resultaat van de setup
        const [tables] = await db.query('SHOW TABLES');
        console.log('Tabellen in database:');
        for (const table of tables) {
            const tableName = Object.values(table)[0];
            const [rows] = await db.query(`SELECT COUNT(*) as count FROM ${tableName}`);
            console.log(`   - ${tableName}: ${rows[0].count} records`);
        }
        
        console.log('\nServer kan gestart worden met: npm run dev\n');
        
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

setupDatabase();

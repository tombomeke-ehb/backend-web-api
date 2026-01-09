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

// Gebruik SQLite in plaats van MySQL
import dbPromise from './config/database.sqlite.js';

/**
 * Array van SQL statements die uitgevoerd moeten worden
 * Volgorde is belangrijk: eerst categories (parent), dan recipes (child)
 */
const sqlStatements = [
    // Categories tabel
    `CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        deleted_at DATETIME
    )`,
    // Recipes tabel
    `CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        prep_time INTEGER NOT NULL,
        cook_time INTEGER NOT NULL,
        servings INTEGER NOT NULL DEFAULT 1,
        difficulty TEXT CHECK(difficulty IN ('easy','medium','hard')) DEFAULT 'medium',
        category_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        deleted_at DATETIME,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    )`,
];

const categorySeed = [
    ['Ontbijt', 'Recepten voor een gezond ontbijt'],
    ['Lunch', 'Snelle en makkelijke lunch recepten'],
    ['Diner', 'Hoofdgerechten voor het avondeten'],
    ['Dessert', 'Zoete lekkernijen en nagerechten'],
    ['Vegetarisch', 'Vleesvije gerechten'],
    ['Vegan', 'Volledig plantaardig']
];

const recipeSeed = [
    // title, description, ingredients, instructions, prep_time, cook_time, servings, difficulty, category_id
    ['Pannenkoeken', 'Heerlijke Nederlandse pannenkoeken', '250g bloem, 2 eieren, 500ml melk, snufje zout, boter', '1. Mix alle ingrediënten tot een glad beslag. 2. Laat 10 minuten rusten. 3. Bak in een hete pan met boter. 4. Draai om na 2 minuten.', 10, 15, 4, 'easy', 1],
    ['Scrambled Eggs', 'Zachte roerei met kruiden', '4 eieren, 2 el boter, 2 el room, bieslook, zout en peper', '1. Klop de eieren los met room. 2. Smelt boter op laag vuur. 3. Voeg eieren toe en roer continu. 4. Haal van het vuur als ze nog zacht zijn.', 5, 8, 2, 'easy', 1],
    ['French Toast', 'Wentelteefjes met kaneel', '4 sneden brioche, 2 eieren, 100ml melk, kaneel, suiker, boter', '1. Mix eieren, melk en kaneel. 2. Dip het brood in het mengsel. 3. Bak goudbruin in boter. 4. Bestrooi met poedersuiker.', 5, 10, 2, 'easy', 1],
    ['Avocado Toast', 'Geroosterd brood met avocado en ei', '2 sneden zuurdesembrood, 1 avocado, 2 eieren, chili vlokken, citroensap', '1. Rooster het brood. 2. Prak de avocado met citroensap. 3. Pocheer de eieren. 4. Beleg het brood en top met ei.', 10, 5, 2, 'easy', 1],
    ['Overnight Oats', 'Kant-en-klaar havermout ontbijt', '100g havermout, 200ml amandelmelk, 1 el chiazaad, honing, vers fruit', '1. Mix havermout, melk en chiazaad. 2. Voeg honing toe naar smaak. 3. Laat een nacht in de koelkast staan. 4. Top met vers fruit.', 5, 0, 2, 'easy', 1],
    ['Caesar Salade', 'Frisse salade met kip en parmezaan', 'Romaine sla, 2 kipfilets, 50g parmezaan, croutons, caesar dressing, knoflook', '1. Gril de kip gaar. 2. Snijd de sla in stukken. 3. Maak croutons in de pan. 4. Mix alles met dressing.', 20, 10, 2, 'easy', 2],
    ['Club Sandwich', 'Klassieke driedubbele sandwich', '3 sneden toastbrood, kip, bacon, sla, tomaat, mayo, ei', '1. Rooster het brood. 2. Bak bacon krokant. 3. Snijd kip en groenten. 4. Bouw de sandwich in lagen.', 15, 10, 1, 'easy', 2],
    ['Tomatensoep', 'Romige soep met verse tomaten', '1kg tomaten, 1 ui, 2 teentjes knoflook, basilicum, room, bouillon', '1. Bak ui en knoflook. 2. Voeg tomaten en bouillon toe. 3. Kook 20 minuten. 4. Pureer en voeg room toe.', 10, 25, 4, 'easy', 2],
    ['Griekse Salade', 'Frisse salade met feta en olijven', '2 komkommers, 4 tomaten, 1 rode ui, 200g feta, olijven, oregano, olijfolie', '1. Snijd alle groenten in stukken. 2. Verkruimel de feta. 3. Voeg olijven toe. 4. Besprenkel met olijfolie.', 15, 0, 4, 'easy', 2],
    ['Wraps met Hummus', 'Gezonde wraps met groenten', '4 tortillas, 200g hummus, komkommer, paprika, feta, rucola', '1. Verdeel hummus over de wraps. 2. Snijd groenten in reepjes. 3. Beleg de wraps. 4. Rol strak op.', 10, 0, 4, 'easy', 2],
    ['Spaghetti Bolognese', 'Klassieke Italiaanse pasta', '400g spaghetti, 500g gehakt, 400g tomaten, ui, knoflook, wortel, selderij', '1. Bak het gehakt met ui en knoflook. 2. Voeg groenten toe. 3. Voeg tomaten toe en laat 30 min sudderen. 4. Kook de pasta.', 15, 45, 4, 'easy', 3],
    ['Biefstuk met Frieten', 'Perfecte biefstuk medium-rare', '4 biefstukken, 1kg aardappelen, rozemarijn, boter, knoflook', '1. Haal vlees op kamertemperatuur. 2. Snijd en frituur de aardappelen. 3. Bak biefstuk 3 min per kant. 4. Laat 5 min rusten.', 20, 25, 4, 'medium', 3],
    ['Kip Teriyaki', 'Zoete Japanse kip met rijst', '4 kipfilets, 100ml sojasaus, 50ml mirin, 2 el honing, gember, rijst', '1. Maak de teriyaki saus. 2. Marineer de kip 30 minuten. 3. Bak of gril de kip. 4. Serveer met rijst.', 40, 20, 4, 'easy', 3],
    ['Lasagne', 'Italiaanse ovenschotel met lagen', '500g gehakt, lasagnebladen, bechamelsaus, tomatensaus, mozzarella', '1. Maak de vleessaus. 2. Maak bechamelsaus. 3. Bouw de lasagne in lagen. 4. Bak 45 min in de oven.', 30, 45, 6, 'medium', 3],
    ['Beef Bourguignon', 'Franse stoofschotel met rode wijn', '1kg rundvlees, 750ml rode wijn, 200g spekblokjes, champignons, wortels', '1. Braad het vlees aan. 2. Bak spek en groenten. 3. Voeg wijn en kruiden toe. 4. Stoof 2-3 uur.', 30, 180, 6, 'hard', 3],
    ['Risotto ai Funghi', 'Romige paddenstoelen risotto', '300g arborio rijst, 200g gemengde paddenstoelen, witte wijn, parmezaan, bouillon', '1. Bak de paddenstoelen. 2. Fruit de rijst. 3. Voeg schep voor schep bouillon toe. 4. Eindig met kaas.', 15, 30, 4, 'medium', 3],
    ['Tiramisu', 'Italiaans koffiedessert', '500g mascarpone, 4 eieren, 100g suiker, lange vingers, espresso, cacaopoeder', '1. Maak de mascarponecrème. 2. Dip koekjes in koffie. 3. Bouw lagen op. 4. Laat 4 uur koelen.', 30, 0, 8, 'medium', 4],
    ['Chocolate Lava Cake', 'Smeltend hart van chocolade', '200g pure chocolade, 100g boter, 4 eieren, 100g suiker, 50g bloem', '1. Smelt chocolade met boter. 2. Klop eieren met suiker. 3. Meng alles met bloem. 4. Bak 12 minuten op 200°C.', 15, 12, 4, 'medium', 4],
    ['Panna Cotta', 'Romig Italiaans dessert', '500ml room, 100g suiker, 2 blaadjes gelatine, vanille, rode vruchten', '1. Verwarm room met suiker en vanille. 2. Los gelatine op. 3. Giet in vormpjes. 4. Laat 4 uur opstijven.', 10, 10, 4, 'easy', 4],
    ['Appeltaart', 'Hollandse appeltaart met kaneel', '250g bloem, 150g boter, 100g suiker, 1kg appels, kaneel, rozijnen', '1. Maak het deeg. 2. Schil en snijd de appels. 3. Vul de taart. 4. Bak 50 minuten op 180°C.', 30, 50, 8, 'medium', 4],
    ['Crème Brûlée', 'Franse room met karamelkorst', '500ml room, 6 eidooiers, 100g suiker, vanillestok', '1. Verwarm room met vanille. 2. Mix met eidooiers en suiker. 3. Bak au bain-marie. 4. Karameliseer de top.', 15, 45, 6, 'hard', 4],
    ['Shakshuka', 'Midden-Oosterse gepocheerde eieren', '400g tomaten, 4 eieren, paprika, ui, knoflook, komijn, feta', '1. Bak ui, paprika en knoflook. 2. Voeg tomaten en kruiden toe. 3. Maak kuiltjes voor de eieren. 4. Pocheer tot gewenste garing.', 10, 20, 2, 'easy', 5],
    ['Gevulde Paprika', 'Paprika gevuld met rijst en kaas', '4 grote paprikas, 200g rijst, 100g feta, tomaten, kruiden, olijfolie', '1. Kook de rijst. 2. Mix met feta en tomaten. 3. Vul de paprikas. 4. Bak 30 minuten in de oven.', 20, 30, 4, 'easy', 5],
    ['Aubergine Parmigiana', 'Italiaanse aubergine ovenschotel', '2 aubergines, 400g tomatensaus, 250g mozzarella, parmezaan, basilicum', '1. Snijd en gril de aubergine. 2. Bouw lagen met saus en kaas. 3. Bak 40 minuten. 4. Garneer met basilicum.', 25, 40, 4, 'medium', 5],
    ['Pad Thai Vegetarisch', 'Thaise noedels met tofu', '200g rijstnoedels, 200g tofu, taugé, pinda, ei, tamarindesaus, limoen', '1. Week de noedels. 2. Bak de tofu krokant. 3. Roerbak alles met saus. 4. Serveer met pinda en limoen.', 15, 15, 2, 'medium', 5],
    ['Spinazie Quiche', 'Hartige taart met spinazie en feta', '1 rol bladerdeeg, 300g spinazie, 150g feta, 3 eieren, 200ml room', '1. Bekleed de vorm met deeg. 2. Mix vulling. 3. Giet in de vorm. 4. Bak 35 minuten op 180°C.', 15, 35, 6, 'easy', 5],
    ['Buddha Bowl', 'Gezonde bowl met granen en groenten', 'Quinoa, kikkererwten, avocado, rode kool, wortel, tahini dressing', '1. Kook de quinoa. 2. Rooster kikkererwten met kruiden. 3. Snijd alle groenten. 4. Rangschik in een kom met dressing.', 20, 25, 2, 'easy', 6],
    ['Vegan Curry', 'Romige kokoscurry met groenten', '400ml kokosmelk, 400g kikkererwten, spinazie, currypasta, gember, rijst', '1. Fruit de pasta met gember. 2. Voeg kokosmelk toe. 3. Voeg kikkererwten en spinazie toe. 4. Serveer met rijst.', 10, 20, 4, 'easy', 6],
    ['Linzensoep', 'Hartige soep vol proteïne', '300g rode linzen, wortel, selderij, ui, knoflook, komijn, bouillon', '1. Fruit de groenten. 2. Voeg linzen en bouillon toe. 3. Kook 25 minuten. 4. Pureer gedeeltelijk.', 10, 30, 4, 'easy', 6],
    ['Vegan Pad Thai', 'Plantaardige Thaise noedels', '200g rijstnoedels, tofu, taugé, bosui, pinda, tamarindesaus, limoen', '1. Week de noedels. 2. Bak tofu krokant. 3. Wok alles met saus. 4. Top met pinda en limoen.', 15, 15, 2, 'medium', 6],
    ['Falafel Wrap', 'Krokante falafel met hummus', 'Kikkererwten, ui, knoflook, koriander, komijn, tortillas, hummus, salade', '1. Maal kikkererwten met kruiden. 2. Vorm balletjes. 3. Frituur of bak. 4. Serveer in wrap met hummus.', 20, 15, 4, 'medium', 6]
];

async function setupDatabase() {
    try {
        const db = await dbPromise;
        console.log('📦 SQLite database setup starten...\n');
        // Tabellen aanmaken
        for (const statement of sqlStatements) {
            await db.exec(statement);
        }
        // Categories seeden (UPSERT)
        for (const [name, description] of categorySeed) {
            await db.run(
                `INSERT INTO categories (name, description) VALUES (?, ?)
                ON CONFLICT(name) DO UPDATE SET description=excluded.description`,
                [name, description]
            );
        }
        // Recipes seeden (alleen als tabel leeg is)
        const row = await db.get('SELECT COUNT(*) as count FROM recipes');
        if (row.count === 0) {
            for (const r of recipeSeed) {
                await db.run(
                    `INSERT INTO recipes (title, description, ingredients, instructions, prep_time, cook_time, servings, difficulty, category_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    r
                );
            }
        }
        // Toon resultaat
        const tables = await db.all(`SELECT name FROM sqlite_master WHERE type='table'`);
        console.log('Tabellen in database:');
        for (const t of tables) {
            const row = await db.get(`SELECT COUNT(*) as count FROM ${t.name}`);
            console.log(`   - ${t.name}: ${row.count} records`);
        }
        console.log('\nServer kan gestart worden met: npm run dev\n');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

setupDatabase();

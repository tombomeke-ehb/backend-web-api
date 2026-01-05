# Recipe Manager API - Installatie Instructies

## ⚡ Quick Start

### 1. Database Setup

Je hebt een MySQL server nodig. Voer het volgende bestand uit in je MySQL:

**Bestand:** `database.sql`

**Opties:**
- Via command line: `mysql -u root -p < database.sql`
- Via phpMyAdmin: Importeer het bestand
- Via MySQL Workbench: Open en voer het script uit

Dit script:
- Maakt de `recipe_manager` database aan
- Maakt de `recipes` en `categories` tabellen
- Voegt voorbeeld data toe (3 recipes en 6 categories)

### 2. Environment Configuratie

Pas het `.env` bestand aan met jouw MySQL credentials:

```env
PORT=3000

# Pas deze aan naar jouw MySQL server
DB_HOST=localhost
DB_USER=root                    # ← Jouw MySQL gebruikersnaam
DB_PASSWORD=jouw_wachtwoord    # ← Jouw MySQL wachtwoord
DB_NAME=recipe_manager
DB_PORT=3306
```

### 3. Start de Server

De dependencies zijn al geïnstalleerd! Start de server:

```bash
npm run dev
```

Of voor productie:

```bash
npm start
```

### 4. Test de API

Open je browser en ga naar:
- **API Documentatie:** http://localhost:3000
- **Alle recipes:** http://localhost:3000/api/recipes
- **Alle categories:** http://localhost:3000/api/categories

## 📋 Checklist Project Requirements

### ✅ Functionele Minimum Requirements

- [x] **Twee CRUD interfaces**
  - Recipes: GET lijst, GET detail, POST, PUT, DELETE
  - Categories: GET lijst, GET detail, POST, PUT, DELETE

- [x] **Basisvalidatie**
  - Velden mogen niet leeg zijn
  - Numerieke velden accepteren geen strings
  - Formaat validatie (geen cijfers in namen)

- [x] **Pagination endpoint**
  - `GET /api/recipes?limit=10&offset=0`
  - `GET /api/categories?limit=50&offset=0`

- [x] **Zoeken endpoint**
  - `GET /api/recipes?search=pasta`
  - Zoekt in title, description en ingredients

- [x] **Root documentatie**
  - Volledige HTML pagina op http://localhost:3000
  - Beschrijft alle endpoints met voorbeelden

### ✨ Extra Features (Hoger Cijfer)

- [x] **Geavanceerde validatie**
  - Unieke constraint: category namen moeten uniek zijn
  - Relatie validatie: category met recipes kan niet verwijderd
  - Custom logic: totale tijd (prep + cook) moet minimaal 1 minuut

- [x] **Zoeken op meerdere velden**
  - Search parameter zoekt in 3 velden: title, description, ingredients

- [x] **Resultaten sorteren**
  - Sort op: title, prep_time, cook_time, created_at, servings
  - Order: asc of desc
  - Voorbeeld: `GET /api/recipes?sort=prep_time&order=asc`

- [x] **Advanced filtering**
  - Filter op difficulty: `?difficulty=easy`
  - Filter op category: `?category_id=1`
  - Combineer filters: `?difficulty=easy&category_id=1&search=kip`

- [x] **Extra endpoints**
  - `GET /api/categories/:id/recipes` - Alle recipes van een category

### ✅ Technische Requirements

- [x] Node.js versie 20+
- [x] Express framework
- [x] MySQL database connectie
- [x] Juiste HTTP verbs (GET, POST, PUT, DELETE)

## 🧪 Test Voorbeelden

### Recipes Testen

```bash
# Alle recipes ophalen (eerste 10)
curl http://localhost:3000/api/recipes

# Zoeken naar "pannenkoeken"
curl http://localhost:3000/api/recipes?search=pannenkoeken

# Makkelijke recipes, gesorteerd op bereidingstijd
curl http://localhost:3000/api/recipes?difficulty=easy&sort=prep_time&order=asc

# Recipe details ophalen (ID 1)
curl http://localhost:3000/api/recipes/1

# Nieuwe recipe aanmaken
curl -X POST http://localhost:3000/api/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Omelet",
    "ingredients": "3 eieren, 50ml melk, zout, peper",
    "instructions": "1. Klop de eieren. 2. Voeg melk toe. 3. Bak in een pan.",
    "prep_time": 5,
    "cook_time": 10,
    "servings": 2,
    "difficulty": "easy",
    "category_id": 1
  }'

# Recipe updaten
curl -X PUT http://localhost:3000/api/recipes/1 \
  -H "Content-Type: application/json" \
  -d '{"servings": 6}'

# Recipe verwijderen
curl -X DELETE http://localhost:3000/api/recipes/1
```

### Categories Testen

```bash
# Alle categories ophalen
curl http://localhost:3000/api/categories

# Category details
curl http://localhost:3000/api/categories/1

# Recipes van een category
curl http://localhost:3000/api/categories/1/recipes

# Nieuwe category aanmaken
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Snacks",
    "description": "Kleine hapjes en snacks"
  }'
```

## 📁 Project Architectuur

```
MVC Pattern + Validators:

┌─────────────┐
│   Routes    │  → Definiëren endpoints en HTTP methods
└──────┬──────┘
       │
┌──────▼──────┐
│ Validators  │  → Valideren input data
└──────┬──────┘
       │
┌──────▼──────┐
│ Controllers │  → Behandelen business logic
└──────┬──────┘
       │
┌──────▼──────┐
│   Models    │  → Database queries
└──────┬──────┘
       │
┌──────▼──────┐
│   MySQL     │  → Data opslag
└─────────────┘
```

## 💡 Tips voor Demonstratie

1. **Start met de documentatie pagina** - Laat zien hoe professioneel het eruit ziet
2. **Demonstreer CRUD** - Voeg een recipe toe, update, en verwijder
3. **Toon validatie** - Probeer een recipe met lege titel, toon error response
4. **Pagination demonstreren** - `?limit=2&offset=0` en dan `?limit=2&offset=2`
5. **Search functionaliteit** - Zoek op "pasta" of "kip"
6. **Geavanceerde features** - Probeer een category met recipes te verwijderen
7. **Sorting** - Toon recipes gesorteerd op kooktijd

## 🐛 Troubleshooting

### Database connectie mislukt?
- Check of MySQL server draait
- Controleer credentials in `.env`
- Test connectie: `mysql -u root -p` in terminal

### Server start niet?
- Check of poort 3000 vrij is
- Kijk naar error messages in de terminal
- Controleer of alle dependencies geïnstalleerd zijn: `npm install`

### Validatie errors?
- Check de API documentatie op http://localhost:3000
- Kijk naar de required/optional badges bij parameters
- Test met de voorbeelden in de documentatie

## 📊 Database Schema

**Recipes Table:**
- id (INT, PRIMARY KEY)
- title (VARCHAR 200)
- description (TEXT)
- ingredients (TEXT)
- instructions (TEXT)
- prep_time (INT)
- cook_time (INT)
- servings (INT)
- difficulty (ENUM: easy, medium, hard)
- category_id (INT, FOREIGN KEY)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**Categories Table:**
- id (INT, PRIMARY KEY)
- name (VARCHAR 100, UNIQUE)
- description (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**Relatie:**
- Recipes.category_id → Categories.id (ON DELETE SET NULL)

## ✅ Code Kwaliteit Features

- **Error Handling**: Try-catch blocks in alle controllers
- **Logging**: Console logs voor debugging
- **Validatie**: Express-validator voor input validatie
- **Security**: Prepared statements (SQL injection preventie)
- **Code Structuur**: MVC pattern
- **Documentation**: Inline comments met bronvermelding
- **Environment Variables**: Gevoelige data in .env

## 🎓 Bronvermelding in Code

Alle externe code is voorzien van bronvermelding:
- Connection pooling: MySQL2 documentatie
- Validation middleware: Express-validator documentatie
- Best practices: Node.js community guidelines

Zie comments in de code voor specifieke bronnen.

---

**Succes met je project! 🚀**

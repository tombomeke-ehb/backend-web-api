# Recipe Manager API - Installatie Instructies

Een volledige gids voor het installeren en configureren van de Recipe Manager API.

## Vereisten

Zorg ervoor dat je het volgende hebt geïnstalleerd op je systeem:

- **Node.js**: versie 20.0.0 of hoger ([download](https://nodejs.org))
  ```bash
  node --version  # Controleer versie
  ```
- **npm**: wordt meegeleverd met Node.js
  ```bash
  npm --version
  ```
- **MySQL Database** (een van de volgende opties):
  - Lokale MySQL server ([download](https://dev.mysql.com/downloads/mysql/))
  - Cloud provider zoals Aiven, AWS RDS of Google Cloud SQL

## Quick Start

### 1. Repository Clonen

```bash
git clone <repository-url>
cd backend-web-api
```

### 2. Dependencies Installeren

```bash
npm install
```

Dit installeert alle benodigde packages (Express, MySQL2, dotenv, express-validator, etc.)

### 3. Environment Configuratie

Pas het `.env` bestand aan met jouw MySQL credentials:

**Voor lokale MySQL:**
```env
PORT=3000
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=jouw_wachtwoord
DB_DATABASE=recipe_manager
DB_PORT=3306
```

**Voor cloud database (zoals Aiven):**
```env
PORT=3000
DB_HOST=jouw-database.aivencloud.com
DB_USERNAME=avnadmin
DB_PASSWORD=jouw_wachtwoord
DB_DATABASE=defaultdb
DB_PORT=10547
DB_SSL_CA=./config/private/ca.pem  # Pad naar SSL certificaat
```

### 2. Database Setup

Voer het setup script uit om de database tabellen aan te maken:

```bash
node setup-database.js
```

Dit script:
- Maakt de `recipes` en `categories` tabellen aan
- Voegt voorbeeld data toe (3 recipes en 6 categories)
- Werkt met lokale én cloud databases
- Je kunt het meerdere keren uitvoeren zonder problemen

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

## Project Requirements

### Functionele Minimum Requirements

- **Twee CRUD interfaces**
  - Recipes: GET lijst, GET detail, POST, PUT, DELETE
  - Categories: GET lijst, GET detail, POST, PUT, DELETE

- **Basisvalidatie**
  - Velden mogen niet leeg zijn
  - Numerieke velden accepteren geen strings
  - Formaat validatie (geen cijfers in namen)

- **Pagination endpoint**
  - `GET /api/recipes?limit=10&offset=0`
  - `GET /api/categories?limit=50&offset=0`

- **Zoeken endpoint**
  - `GET /api/recipes?search=pasta`
  - Zoekt in title, description en ingredients

- **Root documentatie**
  - Volledige HTML pagina op http://localhost:3000
  - Beschrijft alle endpoints met voorbeelden

### Extra Features

- **Geavanceerde validatie**
  - Unieke constraint: category namen moeten uniek zijn
  - Relatie validatie: category met recipes kan niet verwijderd
  - Custom logic: totale tijd (prep + cook) moet minimaal 1 minuut

- **Zoeken op meerdere velden**
  - Search parameter zoekt in 3 velden: title, description, ingredients

- **Resultaten sorteren**
  - Sort op: title, prep_time, cook_time, created_at, servings
  - Order: asc of desc

- **Advanced filtering**
  - Filter op difficulty en category_id
  - Combineer meerdere filters

- **Extra endpoints**
  - `GET /api/categories/:id/recipes` - Alle recipes van een category

### Technische Requirements

- Node.js versie 20+
- Express framework
- MySQL database connectie
- Juiste HTTP verbs (GET, POST, PUT, DELETE)

## Test Voorbeelden

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

## Project Architectuur

```
MVC Pattern + Validators:

Routes → Validators → Controllers → Models → MySQL
```

## Troubleshooting

### Database connectie mislukt?
**Symptomen:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Oplossingen:**
- Controleer of MySQL server draait:
  - Windows: Check Services app (services.msc)
  - Mac: Controleer in System Preferences > MySQL
  - Linux: `sudo service mysql status`
- Verifieer credentials in `.env` bestand
- Test connectie handmatig: `mysql -h localhost -u root -p`
- Controleer DB_PORT (default: 3306)

### Server start niet op poort 3000?
**Symptomen:** `EADDRINUSE: address already in use :::3000`

**Oplossingen:**
- Wijzig PORT in `.env` naar bijvoorbeeld 3001
- Of stop het programma dat poort 3000 gebruikt:
  - Windows: `netstat -ano | findstr :3000` en kill het process ID
  - Mac/Linux: `lsof -i :3000` en kill het process

### Setup script werkt niet?
- Zorg dat `.env` correct ingesteld is
- Controleer databasenaam in `.env`
- Run met verbose output: `node setup-database.js --debug`
- Check MySQL user rechten (CREATE, INSERT)

## 📊 Database Schema

**Recipes Table:**
```sql
CREATE TABLE recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  ingredients TEXT NOT NULL,
  instructions TEXT NOT NULL,
  prep_time INT NOT NULL,
  cook_time INT NOT NULL,
  servings INT NOT NULL,
  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  category_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

**Categories Table:**
```sql
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Code Kwaliteit

- Error Handling: Try-catch blocks in controllers
- Logging: Console logs voor debugging
- Validatie: Express-validator input validatie
- Security: Prepared statements (SQL injection preventie)
- Code Structuur: MVC pattern
- Documentation: Inline comments met bronvermelding
- Environment Variables: Gevoelige data in .env

## Licentie & Contact

Dit project is gemaakt als onderdeel van het schoolprogramma.
Voor vragen of problemen: Raadpleeg de projectdocumentatie of contacteer de docent.

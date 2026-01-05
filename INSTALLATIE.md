# Recipe Manager API - Installatie Instructies

Stap-voor-stap gids voor het installeren en configureren van de Recipe Manager API.

Voor meer informatie over requirements, database schema en architectuur, zie [REQUIREMENTS.md](REQUIREMENTS.md).

## Vereisten

Zorg ervoor dat je het volgende hebt geïnstalleerd:

- **Node.js**: versie 20.0.0 of hoger - [download](https://nodejs.org)
- **npm**: wordt meegeleverd met Node.js
- **MySQL Database**: lokaal of cloud (Aiven, AWS RDS, Google Cloud SQL)

Controleer versies:
```bash
node --version
npm --version
```

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

### 3. Environment Configuratie

Kopieer `.env.example` naar `.env`:
```bash
cp .env.example .env
```

Edit `.env` met jouw database credentials:

**Lokale MySQL:**
```env
PORT=3000
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=jouw_wachtwoord
DB_DATABASE=recipe_manager
DB_PORT=3306
```

**Cloud Database (Aiven):**
```env
PORT=3000
DB_HOST=jouw-db.aivencloud.com
DB_USERNAME=avnadmin
DB_PASSWORD=jouw_wachtwoord
DB_DATABASE=defaultdb
DB_PORT=10547
DB_SSL_CA=./config/private/ca.pem
```

### 4. Database Opzetten

```bash
node setup-database.js
```

Dit script:
- Maakt tabellen aan (recipes, categories)
- Voegt voorbeeld data toe
- Werkt met lokale en cloud databases
- Kan meerdere keren uitgevoerd worden

### 5. Server Starten

Development mode (auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

De API is beschikbaar op: `http://localhost:3000`

## Troubleshooting

### Database Connectie Mislukt

**Symptoom:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Oplossing:**
- Controleer of MySQL server draait
  - Windows: Services app (services.msc)
  - Mac: System Preferences > MySQL
  - Linux: `sudo service mysql status`
- Verifieer `.env` credentials
- Test connectie: `mysql -h localhost -u root -p`
- Check DB_PORT (standaard: 3306)

### Poort 3000 Al In Gebruik

**Symptoom:** `EADDRINUSE: address already in use :::3000`

**Oplossing:**
- Wijzig PORT in `.env` (bv. 3001)
- Of stop het process dat poort 3000 gebruikt:
  - Windows: `netstat -ano | findstr :3000`
  - Mac/Linux: `lsof -i :3000`

### Setup Script Werkt Niet

- Zorg dat `.env` correct ingesteld is
- Controleer databasenaam in `.env`
- Verifieer MySQL user rechten (CREATE, INSERT, DROP)
- Zorg dat de database server draait

## Database Schema

Voor complete database schema en veldtypes, zie [REQUIREMENTS.md](REQUIREMENTS.md#database-schema).

## Code Kwaliteit

- Error handling in controllers
- Input validatie via express-validator
- SQL injection preventie (prepared statements)
- MVC pattern architectuur
- Inline code documentation

## Licentie

ISC
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

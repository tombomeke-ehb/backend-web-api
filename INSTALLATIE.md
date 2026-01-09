# Recipe Manager API - Installatie Instructies

Stap-voor-stap gids voor het installeren en configureren van de Recipe Manager API.

Voor meer informatie over requirements, database schema en architectuur, zie [REQUIREMENTS.md](REQUIREMENTS.md).

## Vereisten

Zorg ervoor dat je het volgende hebt geïnstalleerd:

- **Node.js**: versie 20.0.0 of hoger - [download](https://nodejs.org)
- **npm**: wordt meegeleverd met Node.js
- **SQLite**: het databasebestand `dev.sqlite3` wordt meegeleverd in de repository

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

### 3. Server Starten

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

**Symptoom:** Foutmelding over database connectie

**Oplossing:**
- Controleer of het bestand `dev.sqlite3` aanwezig is (wordt meegeleverd)
- Controleer of je Node.js versie >= 20 gebruikt
- Controleer of je `npm install` hebt uitgevoerd

### Poort 3000 Al In Gebruik

**Symptoom:** `EADDRINUSE: address already in use :::3000`

**Oplossing:**
- Wijzig PORT in `.env` (bv. 3001)
- Of stop het process dat poort 3000 gebruikt:
  - Windows: `netstat -ano | findstr :3000`
  - Mac/Linux: `lsof -i :3000`

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

**Voorbeeld tabellen:**
```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME
);

CREATE TABLE recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT NOT NULL,
  instructions TEXT NOT NULL,
  prep_time INTEGER NOT NULL,
  cook_time INTEGER NOT NULL,
  servings INTEGER NOT NULL,
  difficulty TEXT CHECK(difficulty IN ('easy','medium','hard')) DEFAULT 'medium',
  category_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

## Licentie & Contact

Dit project is gemaakt als onderdeel van het schoolprogramma.
Voor vragen of problemen: Raadpleeg de projectdocumentatie of contacteer de docent.

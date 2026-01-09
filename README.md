# Recipe Manager API

Een professionele, database-driven REST API gebouwd met Node.js, Express en SQLite voor het beheren van recepten en receptcategorieën.

## Overzicht

Dit project implementeert een volledige REST API met CRUD-operaties voor twee entiteiten (Recipes en Categories). De API biedt geavanceerde validatie, zoekfunctionaliteit, paginering, filtering en uitgebreide API-documentatie.

**Status:** Production Ready

De applicatie gebruikt standaard SQLite als database. Het databasebestand `dev.sqlite3` wordt meegeleverd in de repository, dus je hoeft geen database te initialiseren.

## Documentatie

- **[REQUIREMENTS.md](REQUIREMENTS.md)** - Functionele/technische requirements, database schema, validatie regels en architectuur
- **[INSTALLATIE.md](INSTALLATIE.md)** - Stap-voor-stap installatie instructies

## Quick Start

```bash
# 1. Dependencies installeren
npm install

# 2. Server starten
npm run dev
```

De API draait op: `http://localhost:3000`

## API Documentatie

Bezoek `http://localhost:3000` in je browser voor de volledige interactieve API documentatie.

## Features Overzicht

### Functionele Minimum Requirements

- **Twee CRUD Interfaces** 
  - Recipes: `GET`, `POST`, `PUT`, `DELETE` op `/api/recipes`
  - Categories: `GET`, `POST`, `PUT`, `DELETE` op `/api/categories`

- **Basisvalidatie**
  - Verplichte velden controleren
  - Type validatie (getal vs tekst)
  - Lengte validatie (min/max karakters)
  - Formaat validatie (letters, nummers, etc)

- **Pagination Support**
  - Limit en offset parameters op alle list endpoints
  - Metadata in response (totaal aantal items)

- **Search Functionaliteit**
  - `GET /api/recipes?search=term` - zoekt in meerdere velden
  - `GET /api/categories?search=term` - zoekt in naam en beschrijving

- **API Documentatie**
  - Volledige HTML documentatie op `/`
  - Interactieve demo op `/demo`

### Extra Features

- **Geavanceerde Validatie**
  - Unieke constraints (category namen moeten uniek zijn)
  - Relatie validatie (voorkom delete met gekoppelde records)
  - Custom validatie (totale bereidingstijd >= 1 minuut)
  - Regex patterns voor formaat checks

- **Multi-Field Search** - Zoekt simultaan in title, description en ingredients

- **Sorting Support** - Sort op title, prep_time, cook_time, created_at, servings

- **Filtering** - Filter op difficulty level en category_id

- **Rate Limiting** - Bescherming tegen misbruik (100 req/15min, 30 writes/15min)

- **Security Headers** - Helmet.js voor HTTP security headers

- **CORS Support** - Cross-origin requests configuratie

- **Soft Delete** - Data markeren als verwijderd i.p.v. permanent verwijderen
  - `DELETE /api/recipes/:id` - soft delete
  - `DELETE /api/recipes/:id/hard` - hard delete (permanent)
  - `POST /api/recipes/:id/restore` - herstel verwijderde items
  - `GET /api/recipes/deleted` - bekijk verwijderde items

- **Health Check** - `GET /api/health` voor monitoring

- **Statistieken** - `GET /api/stats` voor database statistieken

- **Data Export** 
  - `GET /api/export/json` - exporteer als JSON
  - `GET /api/export/csv` - exporteer als CSV

- **Enhanced Responses** - Recipe count per category, volledige relatie info

- **Request Logging** - Gedetailleerde logging met response times

### Technische Requirements

- **Node.js**: versie 20.0.0 of hoger
- **Express**: Web framework
- **SQLite**: Database (bestand `dev.sqlite3` wordt meegeleverd)
- **HTTP Verbs**: Correct gebruik van GET, POST, PUT, DELETE
- **REST API**: Follows REST design principles

## Installatie & Setup

Voor gedetailleerde installatie instructies, zie [INSTALLATIE.md](INSTALLATIE.md)

### Vereisten
- Node.js versie 20 of hoger
- npm of yarn package manager

### Quick Start

**Stap 1: Dependencies installeren**

```bash
npm install
```

**Stap 2: Server starten**

```bash
npm run dev
```

De server draait nu op: `http://localhost:3000`

Voor meer details en troubleshooting, zie [INSTALLATIE.md](INSTALLATIE.md).

### Database Opties

Het project gebruikt standaard SQLite. Wil je MySQL gebruiken, pas dan de database configuratie aan in `config/database.js` en `.env`.

## API Documentatie

Bezoek `http://localhost:3000` in je browser voor de volledige interactieve API documentatie.

## Voorbeelden

```bash
# Zoeken naar pasta recipes
curl "http://localhost:3000/api/recipes?search=pasta"

# Makkelijke recipes, gesorteerd op bereidingstijd
curl "http://localhost:3000/api/recipes?difficulty=easy&sort=prep_time&order=asc"

# Pagination (5 results, start bij 0)
curl "http://localhost:3000/api/recipes?limit=5&offset=0"

# Nieuwe recipe aanmaken
curl -X POST http://localhost:3000/api/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Risotto",
    "ingredients": "rice, broth",
    "instructions": "Cook",
    "prep_time": 10,
    "cook_time": 20,
    "servings": 4,
    "difficulty": "medium",
    "category_id": 1
  }'
```

## Gebruikte Technologieën

| Technologie | Versie | Doel |
|-------------|--------|------|
| Node.js | 20.0.0+ | JavaScript runtime |
| Express | 4.18.2 | Web framework |
| MySQL2 | 3.6.5 | Database driver |
| express-validator | 7.0.1 | Input validatie |
| dotenv | 16.3.1 | Environment variables |
| nodemon | 3.0.2 | Development tool |

## Testing

De API kan getest worden met:
- Browser - Voor GET requests
- Postman - Voor alle HTTP methods
- cURL - Command-line testing
- Thunder Client - VS Code extensie

## Bronvermelding

Dit project is geheel origineel geschreven. Gebruikte bronnen:

### Officiële Documentatie
- [Node.js Documentation](https://nodejs.org/docs/latest/api/) - Server runtime
- [Express.js Guide](https://expressjs.com/) - Web framework
- [MySQL Documentation](https://dev.mysql.com/doc/refman/8.0/en/) - Database
- [express-validator](https://express-validator.github.io/docs/) - Input validatie

### Database & Security
- [MySQL SSL Connections](https://dev.mysql.com/doc/refman/8.0/en/using-encrypted-connections.html) - Cloud database security
- [Node.js Security](https://nodejs.org/en/docs/guides/security/) - Best practices

### REST API Design
- [REST API Design Guidelines](https://restfulapi.net/) - HTTP methods en patterns
- [JSON API Specification](https://jsonapi.org/) - Response format design

### AI Assistance
- [GitHub Copilot](https://github.com/features/copilot) - Code generation, debugging en optimization
  - Gebruikt voor code suggestions en problem-solving
  - Alle gegenereerde code is gecontroleerd, aangepast en begrepen

## Auteur

Backend Web API Project - EHB 2026

## Licentie

ISC

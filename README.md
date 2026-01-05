# Recipe Manager API

Een professionele, database-driven REST API gebouwd met Node.js, Express en MySQL voor het beheren van recepten en receptcategorieën.

## Overzicht

Dit project implementeert een volledige REST API met CRUD-operaties voor twee entiteiten (Recipes en Categories). De API biedt geavanceerde validatie, zoekfunctionaliteit, paginering, filtering en uitgebreide API-documentatie.

**Status:** Production Ready

De applicatie ondersteunt zowel lokale MySQL databases als cloud-gebaseerde databases (Aiven, AWS RDS, Google Cloud SQL) met automatische SSL-configuratie.

## Documentatie

- **[REQUIREMENTS.md](REQUIREMENTS.md)** - Functionele/technische requirements, database schema, validatie regels en architectuur
- **[INSTALLATIE.md](INSTALLATIE.md)** - Stap-voor-stap installatie instructies

## Quick Start

```bash
# 1. Dependencies installeren
npm install

# 2. Environment configureren (pas .env aan met jouw database credentials)
cp .env.example .env

# 3. Database opzetten
node setup-database.js

# 4. Server starten
npm run dev
```

De API draait op: `http://localhost:3000`

## API Documentatie

Bezoek `http://localhost:3000` in je browser voor de volledige interactieve API documentatie.

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

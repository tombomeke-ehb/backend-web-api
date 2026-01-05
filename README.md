# Recipe Manager API

Een professionele, database-driven REST API gebouwd met Node.js, Express en MySQL voor het beheren van recepten en receptcategorieën.

## Project Overzicht

Dit project implementeert een volledige REST API die aan alle functionele en technische requirements voldoet. De API biedt complete CRUD-operaties voor twee entiteiten (Recipes en Categories), geavanceerde validatie, zoekfunctionaliteit, paginering en uitgebreide API-documentatie.

**Status:** Production Ready

### Project Goals
- Professionele API-architectuur met MVC pattern
- Robuuste validatie en error handling
- Uitgebreide documentatie en voorbeelden
- Compliance met REST-API best practices
- Support voor lokale en cloud databases

## ✅ Functionele Requirements - Volledig Afgevinkt

### Minimum Requirements (10-12 punten)

- ✅ **Twee CRUD Interfaces** 
  - Recipes: `GET /api/recipes`, `GET /api/recipes/:id`, `POST`, `PUT`, `DELETE`
  - Categories: `GET /api/categories`, `GET /api/categories/:id`, `POST`, `PUT`, `DELETE`

- **Basisvalidatie**
  - Verplichte velden controleren
  - Type validatie (getal vs tekst)
  - Lengte validatie (min/max karakters)
  - Formaat validatie (letters, nummers, etc)

- **Pagination Support**
  - Limit en offset parameters op alle list endpoints
  - Metadata in response (totaal aantal items)

- **Search Functionaliteit**
  - `GET /api/recipes?search=term` - zoekt in 3 velden
  - `GET /api/categories?search=term` - zoekt in naam

- **API Documentatie**
  - Volledige HTML documentatie op `http://localhost:3000/`
  - Beschrijft alle endpoints met voorbeelden

### Extra Features (voor hoger cijfer)

- **Geavanceerde Validatie**
  - Unieke constraints (category namen moeten uniek zijn)
  - Relatie validatie (prevent delete with foreign keys)
  - Custom validatie (totale tijd >= 1 minuut)
  - Formaat checks (regex patterns)

- **Multi-Field Search** - Zoekt simultaan in title, description en ingredients

- **Sorting Support** - Sort op title, prep_time, cook_time, created_at, servings

- **Filtering** - Filter op difficulty level en category_id

- **Enhanced Responses** - Recipe count per category, volledige relatie info

### Technische Requirements

- **Node.js**: versie 20.0.0 of hoger
- **Express**: Web framework
- **MySQL**: Database support (lokaal en cloud)
- **HTTP Verbs**: Correct gebruik van GET, POST, PUT, DELETE
- **REST API**: Follows REST design principles

## Installatie & Setup

Voor gedetailleerde installatie instructies, zie [INSTALLATIE.md](INSTALLATIE.md)

### Vereisten
- Node.js versie 20 of hoger
- MySQL server (lokaal of cloud zoals Aiven)
- npm of yarn package manager

### Quick Start

**Stap 1: Environment configureren**

Pas `.env` aan met jouw database credentials (ondersteunt lokale én cloud databases met SSL)

**Stap 2: Database opzetten**

```bash
node setup-database.js
```

**Stap 3: Dependencies installeren**

```bash
npm install
```

**Stap 4: Server starten**

```bash
npm run dev
```

De server draait nu op: `http://localhost:3000`

Voor meer details en troubleshooting, zie [INSTALLATIE.md](INSTALLATIE.md).

### Database Opties

Het project ondersteunt:
- **Lokale MySQL** - Standaard setup
- **Cloud databases** - Aiven, AWS RDS, Google Cloud SQL
- **SSL verbindingen** - Automatisch gedetecteerd via `DB_SSL_CA` environment variable

## API Documentatie

Bezoek `http://localhost:3000` in je browser voor de volledige interactieve API documentatie met alle endpoints.

### API Response Voorbeelden

#### Success Response - Recipe Ophalen
```json
{
  "id": 1,
  "title": "Spaghetti Carbonara",
  "description": "Klassieke Italiaanse pasta",
  "ingredients": "400g spaghetti, 200g pancetta, 4 eieren, 100g parmezaan",
  "instructions": "1. Kook pasta. 2. Bak pancetta. 3. Mix eieren met kaas.",
  "prep_time": 10,
  "cook_time": 20,
  "servings": 4,
  "difficulty": "medium",
  "category_id": 3,
  "category_name": "Pasta",
  "created_at": "2025-01-05T10:30:00Z",
  "updated_at": "2025-01-05T10:30:00Z"
}
```

#### Success Response - Categories Met Count
```json
{
  "id": 3,
  "name": "Pasta",
  "description": "Italiaanse pasta recepten",
  "recipe_count": 5,
  "created_at": "2025-01-05T10:00:00Z",
  "updated_at": "2025-01-05T10:00:00Z"
}
```

#### Error Response - Validatie Fout
```json
{
  "status": 400,
  "error": "Validatiefout",
  "message": "Invoervalidatie mislukt",
  "errors": [
    {
      "field": "title",
      "message": "Naam moet tussen 3 en 200 karakters zijn"
    },
    {
      "field": "prep_time",
      "message": "Prep time moet een getal zijn"
    }
  ]
}
```

#### Error Response - Not Found
```json
{
  "status": 404,
  "error": "Niet gevonden",
  "message": "Recipe met ID 999 bestaat niet"
}
```

### Endpoints Overzicht

#### Recipes
- `GET /api/recipes` - Alle recipes ophalen
- `GET /api/recipes/:id` - Eén recipe ophalen
- `POST /api/recipes` - Recipe aanmaken
- `PUT /api/recipes/:id` - Recipe updaten
- `DELETE /api/recipes/:id` - Recipe verwijderen

#### Categories
- `GET /api/categories` - Alle categories ophalen
- `GET /api/categories/:id` - Eén category ophalen
- `GET /api/categories/:id/recipes` - Recipes van een category
- `POST /api/categories` - Category aanmaken
- `PUT /api/categories/:id` - Category updaten
- `DELETE /api/categories/:id` - Category verwijderen

### Voorbeelden

**Zoeken naar pasta recipes:**
```bash
curl http://localhost:3000/api/recipes?search=pasta
```

**Makkelijke recipes, gesorteerd op bereidingstijd:**
```bash
curl http://localhost:3000/api/recipes?difficulty=easy&sort=prep_time&order=asc
```

**Pagination (5 results, start bij 10):**
```bash
curl http://localhost:3000/api/recipes?limit=5&offset=10
```

**Nieuwe recipe aanmaken:**
```bash
curl -X POST http://localhost:3000/api/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Spaghetti Carbonara",
    "ingredients": "400g spaghetti, 200g pancetta, 4 eieren, 100g parmezaan",
    "instructions": "1. Kook de pasta. 2. Bak de pancetta. 3. Mix eieren met kaas.",
    "prep_time": 10,
    "cook_time": 20,
    "servings": 4,
    "difficulty": "medium",
    "category_id": 3
  }'
```

## Architectuur & Code Structuur

### MVC + Validators Patroon

```
Routes (API Endpoints)
    ↓
Validators (Input Validation)
    ↓
Controllers (Business Logic)
    ↓
Models (Database Queries)
    ↓
MySQL Database
```

### Directory Structuur

```
backend-web-api/
├── config/
│   ├── database.js              # Database connection setup
│   └── private/
│       └── ca.pem               # SSL certificate (for cloud DB)
│
├── controllers/
│   ├── recipeController.js      # Recipe business logic
│   └── categoryController.js    # Category business logic
│
├── models/
│   ├── Recipe.js                # Recipe database model
│   └── Category.js              # Category database model
│
├── routes/
│   ├── recipes.js               # Recipe endpoints
│   └── categories.js            # Category endpoints
│
├── validators/
│   ├── recipeValidators.js      # Recipe input validation rules
│   └── categoryValidators.js    # Category input validation rules
│
├── public/
│   └── index.html               # Interactive API documentation
│
├── server.js                    # Main server application
├── setup-database.js            # Database initialization script
├── package.json                 # Dependencies & scripts
├── .env.example                 # Environment variables template
└── INSTALLATIE.md               # Installation guide (Dutch)
```

### Code Conventions

- **Controllers**: Behandelen HTTP requests, roepen models aan
- **Models**: Direct database queries, geen business logic
- **Validators**: express-validator middleware, input validation
- **Routes**: Connecteren validators → controllers → database
- **Error Handling**: Consistent error responses met status codes

## Gebruikte Technologieën

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MySQL2**: MySQL database driver met Promise support
- **express-validator**: Input validatie middleware
- **dotenv**: Environment variabelen beheer
- **nodemon**: Development tool voor auto-reload

## Validatie & Error Handling

#### Recipe Validatie
| Veld | Regels | Type |
|------|--------|------|
| title | 3-200 chars, letters/numbers/punctuation | String |
| description | Max 500 chars | String |
| ingredients | Min 10 chars | String |
| instructions | Min 20 chars | String |
| prep_time | 0-1440 minuten | Integer |
| cook_time | 0-1440 minuten | Integer |
| servings | 1-100 | Integer |
| difficulty | `easy`, `medium`, `hard` | Enum |
| category_id | Bestaande category ID | Integer |

**Custom Rules:**
- Total time (prep + cook) moet >= 1 minuut
- Category moet bestaan voordat recipe wordt aangemaakt

#### Category Validatie
| Veld | Regels | Type |
|------|--------|------|
| name | 2-100 chars, **unieke** naam, alleen letters | String |
| description | Max 500 chars | String |

**Custom Rules:**
- Category kan niet verwijderd worden als recipes eraan gekoppeld zijn
- Namen moeten uniek zijn in database

### HTTP Status Codes

| Code | Scenario |
|------|----------|
| 200 | Succesvol GET/PUT request |
| 201 | Resource succesvol aangemaakt (POST) |
| 204 | Resource succesvol verwijderd (DELETE) |
| 400 | Validatiefout in input |
| 404 | Resource niet gevonden |
| 409 | Conflict (bv. unieke constraint violation) |
| 422 | Unprocessable Entity (relatie validatie fout) |
| 500 | Server error |

## Testing de API

### Testing Tools

| Tool | Use Case |
|------|----------|
| Browser | Testen GET requests, documentatie bekijken |
| Postman | Volledig API testen met alle HTTP methods |
| cURL | Command-line testing (zie voorbeelden boven) |
| Thunder Client | VS Code extensie voor integraal testen |
| REST Client | VS Code extensie met `.rest` files |

### Manueel Testen

```bash
# Health check
curl http://localhost:3000

# Get all recipes
curl http://localhost:3000/api/recipes

# Search
curl "http://localhost:3000/api/recipes?search=pasta"

# With pagination
curl "http://localhost:3000/api/recipes?limit=5&offset=0"

# Create new recipe
curl -X POST http://localhost:3000/api/recipes \
  -H "Content-Type: application/json" \
  -d '{"title":"Risotto","ingredients":"rice,broth","instructions":"Cook","prep_time":10,"cook_time":20,"servings":4,"difficulty":"medium","category_id":1}'

# Update
curl -X PUT http://localhost:3000/api/recipes/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Recipe"}'

# Delete
curl -X DELETE http://localhost:3000/api/recipes/1
```

## Bronvermelding

Dit project is ontwikkeld met behulp van officiële documentatie en community best practices. Alle code is zelfgeschreven.

### Frameworks & Libraries
- **Node.js Documentation** - https://nodejs.org/docs/latest/api/
  - Server-side JavaScript runtime
- **Express.js Documentation** - https://expressjs.com/
  - Web framework en routing
- **MySQL2 Package** - https://github.com/sidorares/node-mysql2
  - Database connectie met Promise support
- **express-validator** - https://express-validator.github.io/docs/
  - Input validatie middleware
- **dotenv** - https://github.com/motdotla/dotenv
  - Environment variables management

### Database & Security
- **MySQL 8.0 Documentation** - https://dev.mysql.com/doc/refman/8.0/en/
  - SQL syntax en SSL configuratie
- **MySQL SSL Connections** - https://dev.mysql.com/doc/refman/8.0/en/using-encrypted-connections.html
  - Beveiligde cloud database connecties

### Development Standards
- **Node.js Best Practices** - https://github.com/goldbergyoni/nodebestpractices
- **REST API Design Guidelines** - https://restfulapi.net/

## Auteur

Backend Web API Project - EHB 2026

## Licentie

ISC

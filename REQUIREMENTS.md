# Recipe Manager API - Requirements & Specifications

## Project Beschrijving

De Recipe Manager API is een complete REST API voor het beheren van recepten en receptcategorieën. Het systeem ondersteunt volledige CRUD-operaties, geavanceerde zoeking, filtering, paginering en validatie. De API is gebouwd met Node.js en Express, en gebruikt MySQL als database.

## Functionele Requirements

### Minimum Requirements

- **Twee CRUD Interfaces** 
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

### Extra Features

- **Geavanceerde Validatie**
  - Unieke constraints (category namen moeten uniek zijn)
  - Relatie validatie (prevent delete with foreign keys)
  - Custom validatie (totale tijd >= 1 minuut)
  - Formaat checks (regex patterns)

- **Multi-Field Search** - Zoekt simultaan in title, description en ingredients

- **Sorting Support** - Sort op title, prep_time, cook_time, created_at, servings

- **Filtering** - Filter op difficulty level en category_id

- **Enhanced Responses** - Recipe count per category, volledige relatie info

## Technische Requirements

- **Node.js**: versie 20.0.0 of hoger
- **Express**: Web framework
- **MySQL**: Database support (lokaal en cloud)
- **HTTP Verbs**: Correct gebruik van GET, POST, PUT, DELETE
- **REST API**: Follows REST design principles

## Database Schema

### Recipes Table

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

**Velden:**
- `id`: Unieke identificatie
- `title`: Recipe naam (3-200 karakters)
- `description`: Korte beschrijving (optioneel, max 500 chars)
- `ingredients`: Ingrediënten lijst (min 10 chars)
- `instructions`: Bereidingsinstructies (min 20 chars)
- `prep_time`: Voorbereidingstijd in minuten (0-1440)
- `cook_time`: Kooktijd in minuten (0-1440)
- `servings`: Aantal porties (1-100)
- `difficulty`: Moeilijkheidsgraad (easy, medium, hard)
- `category_id`: Link naar category
- `created_at`, `updated_at`: Timestamps

### Categories Table

```sql
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Velden:**
- `id`: Unieke identificatie
- `name`: Category naam (2-100 karakters, UNIEKE)
- `description`: Beschrijving (optioneel, max 500 chars)
- `created_at`, `updated_at`: Timestamps

### Relaties

- **Recipes → Categories**: Many-to-One
  - `recipes.category_id` verwijst naar `categories.id`
  - Category kan niet verwijderd worden als recipes eraan gekoppeld zijn

## Validatie Regels

### Recipe Validatie

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

### Category Validatie

| Veld | Regels | Type |
|------|--------|------|
| name | 2-100 chars, **unieke** naam, alleen letters | String |
| description | Max 500 chars | String |

**Custom Rules:**
- Naam moet uniek zijn in database
- Category kan niet verwijderd worden als recipes eraan gekoppeld zijn

## HTTP Status Codes

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

## Project Architectuur

### MVC + Validators Pattern

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
├── README.md                    # Project overview
├── REQUIREMENTS.md              # This file
└── INSTALLATIE.md               # Installation guide
```

### Code Conventions

- **Controllers**: Behandelen HTTP requests, roepen models aan
- **Models**: Direct database queries, geen business logic
- **Validators**: express-validator middleware, input validation
- **Routes**: Connecteren validators → controllers → database
- **Error Handling**: Consistent error responses met status codes

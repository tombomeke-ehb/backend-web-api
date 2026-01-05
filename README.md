# 🍳 Recipe Manager API

Een professionele database-driven REST API gebouwd met Node.js, Express en MySQL voor het beheren van recepten en categorieën.

## 📋 Project Beschrijving

Dit project is een volledige API die voldoet aan alle functionele en technische requirements:

### Functionele Requirements
- ✅ **Twee CRUD interfaces**: Recipes en Categories
- ✅ **Basisvalidatie**: Alle velden worden gevalideerd op type, lengte en formaat
- ✅ **Pagination**: Limit en offset parameters op alle lijst endpoints
- ✅ **Zoekfunctionaliteit**: Zoeken in meerdere velden
- ✅ **API Documentatie**: Volledige HTML documentatie op root endpoint

### Extra Features (voor hoger cijfer)
- ✅ **Geavanceerde validatie**: 
  - Unieke category namen
  - Relatie checks (category kan niet verwijderd worden met gekoppelde recipes)
  - Totale bereidingstijd validatie
  - Formaat validatie (alleen letters in categorienamen, geen cijfers in titels)
- ✅ **Zoeken op meerdere velden**: Search parameter zoekt in title, description én ingredients
- ✅ **Resultaten sorteren**: Sort op title, prep_time, cook_time, created_at, servings
- ✅ **Filtering**: Filter op difficulty en category_id
- ✅ **Recipe count**: Elk category endpoint toont aantal gekoppelde recipes

### Technische Requirements
- ✅ Node.js versie 20+
- ✅ Express framework
- ✅ MySQL database
- ✅ Correcte HTTP verbs (GET, POST, PUT, DELETE)

## 🚀 Installatie & Setup

> 📖 **Voor gedetailleerde installatie instructies, zie [INSTALLATIE.md](INSTALLATIE.md)**

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

## 📚 API Documentatie

Bezoek `http://localhost:3000` in je browser voor de volledige interactieve API documentatie.

### Quick Start Endpoints

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

## 📁 Project Structuur

```
backend-web-api/
├── config/
│   └── database.js          # Database connectie configuratie
├── controllers/
│   ├── recipeController.js  # Recipe business logic
│   └── categoryController.js # Category business logic
├── models/
│   ├── Recipe.js            # Recipe data model
│   └── Category.js          # Category data model
├── routes/
│   ├── recipes.js           # Recipe routes
│   └── categories.js        # Category routes
├── validators/
│   ├── recipeValidators.js  # Recipe validatie regels
│   └── categoryValidators.js # Category validatie regels
├── public/
│   └── index.html           # API documentatie pagina
├── .env                     # Environment variabelen (niet in git)
├── .env.example             # Environment template
├── .gitignore              # Git ignore regels
├── database.sql            # Database schema en seed data
├── package.json            # Project dependencies
├── server.js               # Main server entry point
└── README.md               # Deze file
```

## 🔧 Gebruikte Technologieën

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MySQL2**: MySQL database driver met Promise support
- **express-validator**: Input validatie middleware
- **dotenv**: Environment variabelen beheer
- **nodemon**: Development tool voor auto-reload

## 📝 Validatie Features

### Recipe Validatie
- Titel: 3-200 karakters, alleen letters/cijfers/leestekens
- Ingrediënten: Minimaal 10 karakters
- Instructies: Minimaal 20 karakters
- Tijden: 0-1440 minuten (max 24 uur)
- Totale tijd moet minimaal 1 minuut zijn
- Porties: 1-100
- Difficulty: easy, medium of hard

### Category Validatie
- Naam moet uniek zijn
- Naam: 2-100 karakters, alleen letters
- Category met gekoppelde recipes kan niet verwijderd worden

## 🎯 Extra Features voor Hoger Cijfer

1. **Geavanceerde Validatie**
   - Unieke constraint checks (category namen)
   - Relatie validatie (prevent delete with dependencies)
   - Custom validatie logica (totale tijd berekening)
   - Formaat validatie (geen cijfers in namen)

2. **Multi-Field Search**
   - Zoek parameter zoekt in 3 velden tegelijk (title, description, ingredients)

3. **Flexible Sorting**
   - Sort op 5 verschillende velden
   - Ascending en descending order support

4. **Advanced Filtering**
   - Filter op difficulty level
   - Filter op category
   - Combineer meerdere filters

5. **Enhanced Responses**
   - Recipe count per category
   - Category naam bij recipe details
   - Volledige pagination metadata

## 🧪 Testing

Je kunt de API testen met:
- **Browser**: Voor GET requests
- **Postman**: Voor alle HTTP methods
- **cURL**: Command line testing (voorbeelden hierboven)
- **Thunder Client**: VS Code extensie

## 📖 Bronvermelding

- Express Validator documentatie: https://express-validator.github.io/docs/
- MySQL2 Connection Pools: https://github.com/sidorares/node-mysql2#using-connection-pools
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices

## 👨‍💻 Auteur

Backend Web API Project - EHB 2026

## 📄 Licentie

ISC

/**
 * Recipe Manager API Server
 * 
 * Een RESTful API voor het beheren van recepten en categorieën
 * Gebouwd met Node.js, Express en MySQL
 * 
 * Features:
 * - Volledige CRUD operaties voor recipes en categories
 * - Geavanceerde filtering, pagination en sorting
 * - Input validatie met express-validator
 * - Rate limiting voor API bescherming
 * - Security headers met Helmet
 * - CORS configuratie
 * - Request logging met timestamps
 * - Health check endpoint
 * - Statistieken endpoint
 * - SSL database connectie support
 * - HTML API documentatie
 * 
 * @author Backend Web API Project - EHB 2026
 */

import express from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { testConnection } from './config/database.js';
import db from './config/database.js';
import recipesRouter from './routes/recipes.js';
import categoriesRouter from './routes/categories.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Track server start time voor uptime berekening
const serverStartTime = new Date();

/**
 * Rate Limiter Configuration
 * Beperkt het aantal requests per IP om misbruik te voorkomen
 * Bron: https://www.npmjs.com/package/express-rate-limit
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuten window
    max: 100, // Maximaal 100 requests per window per IP
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Te veel requests, probeer het later opnieuw',
        retryAfter: '15 minuten'
    }
});

/**
 * Stricter rate limiter voor POST/PUT/DELETE operaties
 * Voorkomt spam en database overbelasting
 */
const writeOperationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30, // Maximaal 30 write operaties per 15 min
    message: {
        success: false,
        message: 'Te veel write operaties, probeer het later opnieuw'
    }
});

// Security Middleware - Helmet voor HTTP security headers
// Bron: https://helmetjs.github.io/
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false
}));

// CORS Configuration - Staat cross-origin requests toe
// Bron: https://www.npmjs.com/package/cors
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']
}));

// Body parsing middleware
app.use(express.json({ limit: '10kb' })); // Limiteer body size voor security
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/**
 * Request Logging Middleware
 * Logt alle requests met timestamp, method, path en response tijd
 */
app.use((req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(
            `${new Date().toISOString()} | ${req.method.padEnd(6)} | ${req.path.padEnd(30)} | ${res.statusCode} | ${duration}ms`
        );
    });
    
    next();
});

// Serve statische assets (docs en demo)
app.use(express.static(join(__dirname, 'public')));

// API Documentation op root
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Demo pagina
app.get('/demo', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'demo.html'));
});

/**
 * Health Check Endpoint
 * Controleert of de API en database beschikbaar zijn
 * Nuttig voor monitoring en load balancers
 * @route GET /api/health
 */
app.get('/api/health', async (req, res) => {
    const uptime = Math.floor((Date.now() - serverStartTime.getTime()) / 1000);
    
    try {
        // Test database connectie
        await db.query('SELECT 1');
        
        res.json({
            success: true,
            status: 'healthy',
            uptime: `${uptime} seconden`,
            timestamp: new Date().toISOString(),
            database: 'connected',
            version: '1.0.0'
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            status: 'unhealthy',
            uptime: `${uptime} seconden`,
            timestamp: new Date().toISOString(),
            database: 'disconnected',
            error: 'Database niet bereikbaar'
        });
    }
});

/**
 * Statistieken Endpoint
 * Geeft overzicht van alle data in de database
 * @route GET /api/stats
 */
app.get('/api/stats', async (req, res) => {
    try {
        // Haal statistieken op uit de database
        const [[recipeStats]] = await db.query(`
            SELECT 
                COUNT(*) as total_recipes,
                AVG(prep_time + cook_time) as avg_total_time,
                SUM(CASE WHEN difficulty = 'easy' THEN 1 ELSE 0 END) as easy_count,
                SUM(CASE WHEN difficulty = 'medium' THEN 1 ELSE 0 END) as medium_count,
                SUM(CASE WHEN difficulty = 'hard' THEN 1 ELSE 0 END) as hard_count,
                AVG(servings) as avg_servings
            FROM recipes
        `);
        
        const [[categoryStats]] = await db.query(`
            SELECT COUNT(*) as total_categories FROM categories
        `);
        
        const [topCategories] = await db.query(`
            SELECT c.name, COUNT(r.id) as recipe_count
            FROM categories c
            LEFT JOIN recipes r ON c.id = r.category_id
            GROUP BY c.id, c.name
            ORDER BY recipe_count DESC
            LIMIT 5
        `);
        
        const [recentRecipes] = await db.query(`
            SELECT title, created_at FROM recipes 
            ORDER BY created_at DESC 
            LIMIT 5
        `);
        
        res.json({
            success: true,
            data: {
                recipes: {
                    total: recipeStats.total_recipes,
                    averageTotalTime: Math.round(recipeStats.avg_total_time || 0),
                    averageServings: Math.round(recipeStats.avg_servings || 0),
                    byDifficulty: {
                        easy: recipeStats.easy_count || 0,
                        medium: recipeStats.medium_count || 0,
                        hard: recipeStats.hard_count || 0
                    }
                },
                categories: {
                    total: categoryStats.total_categories,
                    topCategories: topCategories
                },
                recentRecipes: recentRecipes
            },
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in stats endpoint:', error);
        res.status(500).json({
            success: false,
            message: 'Fout bij ophalen van statistieken',
            error: error.message
        });
    }
});

/**
 * Data Export Endpoint - JSON format
 * Exporteert alle recipes en categories als JSON
 * @route GET /api/export/json
 */
app.get('/api/export/json', async (req, res) => {
    try {
        const [recipes] = await db.query(`
            SELECT r.*, c.name as category_name 
            FROM recipes r
            LEFT JOIN categories c ON r.category_id = c.id
            WHERE r.deleted_at IS NULL
            ORDER BY r.title ASC
        `);
        
        const [categories] = await db.query(`
            SELECT * FROM categories 
            WHERE deleted_at IS NULL
            ORDER BY name ASC
        `);
        
        const exportData = {
            exportedAt: new Date().toISOString(),
            recipes: recipes,
            categories: categories
        };
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=recipes-export.json');
        res.json(exportData);
    } catch (error) {
        console.error('Error in JSON export:', error);
        res.status(500).json({
            success: false,
            message: 'Fout bij exporteren van data'
        });
    }
});

/**
 * Data Export Endpoint - CSV format
 * Exporteert alle recipes als CSV bestand
 * @route GET /api/export/csv
 */
app.get('/api/export/csv', async (req, res) => {
    try {
        const [recipes] = await db.query(`
            SELECT r.id, r.title, r.description, r.ingredients, r.instructions,
                   r.prep_time, r.cook_time, r.servings, r.difficulty,
                   c.name as category_name, r.created_at
            FROM recipes r
            LEFT JOIN categories c ON r.category_id = c.id
            WHERE r.deleted_at IS NULL
            ORDER BY r.title ASC
        `);
        
        // CSV header
        const headers = ['ID', 'Title', 'Description', 'Ingredients', 'Instructions', 
                        'Prep Time (min)', 'Cook Time (min)', 'Servings', 'Difficulty', 
                        'Category', 'Created At'];
        
        // Escape CSV values (handle commas, quotes, newlines)
        const escapeCSV = (value) => {
            if (value === null || value === undefined) return '';
            const str = String(value);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };
        
        // Build CSV content
        let csv = headers.join(',') + '\n';
        
        recipes.forEach(r => {
            const row = [
                r.id,
                escapeCSV(r.title),
                escapeCSV(r.description),
                escapeCSV(r.ingredients),
                escapeCSV(r.instructions),
                r.prep_time,
                r.cook_time,
                r.servings,
                r.difficulty,
                escapeCSV(r.category_name),
                r.created_at ? new Date(r.created_at).toISOString() : ''
            ];
            csv += row.join(',') + '\n';
        });
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=recipes-export.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error in CSV export:', error);
        res.status(500).json({
            success: false,
            message: 'Fout bij exporteren van data'
        });
    }
});

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// Apply stricter rate limiting to write operations
app.use('/api/recipes', (req, res, next) => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        return writeOperationLimiter(req, res, next);
    }
    next();
});
app.use('/api/categories', (req, res, next) => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        return writeOperationLimiter(req, res, next);
    }
    next();
});

// API Routes
app.use('/api/recipes', recipesRouter);
app.use('/api/categories', categoriesRouter);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint niet gevonden'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Er is een serverfout opgetreden',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const startServer = async () => {
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
        console.error('Kan niet starten: database connectie mislukt');
        process.exit(1);
    }
    
    app.listen(PORT, () => {
        console.log(`✓ Server draait op http://localhost:${PORT}`);
        console.log(`✓ API documentatie: http://localhost:${PORT}`);
    });
};

startServer();

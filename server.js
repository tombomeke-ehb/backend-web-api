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
 * - SSL database connectie support
 * - HTML API documentatie
 * 
 * @author Backend Web API Project - EHB 2026
 */

import express from 'express';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import recipesRouter from './routes/recipes.js';
import categoriesRouter from './routes/categories.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
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

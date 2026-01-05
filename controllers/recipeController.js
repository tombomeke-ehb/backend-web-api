import { validationResult } from 'express-validator';
import Recipe from '../models/Recipe.js';

// Helper functie om validatie errors te formatteren
const formatValidationErrors = (errors) => {
    return errors.array().map(err => ({
        field: err.path,
        message: err.msg
    }));
};

// GET /api/recipes - Haal alle recipes op met filtering, pagination en sorting
export const getAllRecipes = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: formatValidationErrors(errors)
            });
        }

        const options = {
            limit: req.query.limit || 10,
            offset: req.query.offset || 0,
            search: req.query.search,
            difficulty: req.query.difficulty,
            category_id: req.query.category_id,
            sort: req.query.sort || 'created_at',
            order: req.query.order || 'desc'
        };

        const result = await Recipe.findAll(options);
        
        res.json({
            success: true,
            data: result.recipes,
            pagination: result.pagination
        });
    } catch (error) {
        console.error('Error in getAllRecipes:', error);
        res.status(500).json({
            success: false,
            message: 'Fout bij ophalen van recipes',
            error: error.message
        });
    }
};

// GET /api/recipes/:id - Haal één recipe op
export const getRecipeById = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: formatValidationErrors(errors)
            });
        }

        const recipe = await Recipe.findById(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe niet gevonden'
            });
        }

        res.json({
            success: true,
            data: recipe
        });
    } catch (error) {
        console.error('Error in getRecipeById:', error);
        res.status(500).json({
            success: false,
            message: 'Fout bij ophalen van recipe',
            error: error.message
        });
    }
};

// POST /api/recipes - Maak een nieuwe recipe
export const createRecipe = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: formatValidationErrors(errors)
            });
        }

        const newRecipe = await Recipe.create(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Recipe succesvol aangemaakt',
            data: newRecipe
        });
    } catch (error) {
        console.error('Error in createRecipe:', error);
        res.status(500).json({
            success: false,
            message: 'Fout bij aanmaken van recipe',
            error: error.message
        });
    }
};

// PUT /api/recipes/:id - Update een recipe
export const updateRecipe = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: formatValidationErrors(errors)
            });
        }

        const existingRecipe = await Recipe.findById(req.params.id);
        if (!existingRecipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe niet gevonden'
            });
        }

        const updatedRecipe = await Recipe.update(req.params.id, req.body);
        
        res.json({
            success: true,
            message: 'Recipe succesvol geüpdatet',
            data: updatedRecipe
        });
    } catch (error) {
        console.error('Error in updateRecipe:', error);
        res.status(500).json({
            success: false,
            message: 'Fout bij updaten van recipe',
            error: error.message
        });
    }
};

// DELETE /api/recipes/:id - Verwijder een recipe
export const deleteRecipe = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: formatValidationErrors(errors)
            });
        }

        const existingRecipe = await Recipe.findById(req.params.id);
        if (!existingRecipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe niet gevonden'
            });
        }

        await Recipe.delete(req.params.id);
        
        res.json({
            success: true,
            message: 'Recipe succesvol verwijderd'
        });
    } catch (error) {
        console.error('Error in deleteRecipe:', error);
        res.status(500).json({
            success: false,
            message: 'Fout bij verwijderen van recipe',
            error: error.message
        });
    }
};

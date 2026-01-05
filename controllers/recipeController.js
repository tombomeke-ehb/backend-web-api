import { validationResult } from 'express-validator';
import Recipe from '../models/Recipe.js';

/**
 * Formatteert validatie errors in een gestandaardiseerd formaat
 * @param {Object} errors - Validatie errors van express-validator
 * @returns {Array} Geformatteerde array van error objecten
 */
const formatValidationErrors = (errors) => {
    return errors.array().map(err => ({
        field: err.path,
        message: err.msg
    }));
};

/**
 * Haal alle recipes op met optionele filtering, pagination en sorting
 * @route GET /api/recipes
 * @param {Object} req.query.limit - Aantal resultaten (default: 10)
 * @param {Object} req.query.offset - Start positie (default: 0)
 * @param {Object} req.query.search - Zoekterm voor title, description, ingredients
 * @param {Object} req.query.difficulty - Filter op moeilijkheidsgraad
 * @param {Object} req.query.category_id - Filter op category ID
 * @param {Object} req.query.sort - Sorteer veld (default: created_at)
 * @param {Object} req.query.order - Sorteer richting asc/desc (default: desc)
 */
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

/**
 * Haal een specifieke recipe op aan de hand van ID
 * @route GET /api/recipes/:id
 * @param {Object} req.params.id - Recipe ID
 */
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

/**
 * Maak een nieuwe recipe aan in de database
 * @route POST /api/recipes
 * @param {Object} req.body - Recipe data (title, ingredients, instructions, etc.)
 */
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

/**
 * Update een bestaande recipe
 * @route PUT /api/recipes/:id
 * @param {Object} req.params.id - Recipe ID
 * @param {Object} req.body - Te updaten velden
 */
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

/**
 * Verwijder een recipe (soft delete)
 * De data blijft behouden maar wordt als verwijderd gemarkeerd
 * @route DELETE /api/recipes/:id
 * @param {Object} req.params.id - Recipe ID
 */
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
            message: 'Recipe succesvol verwijderd (soft delete)'
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

/**
 * Herstel een verwijderde recipe
 * @route POST /api/recipes/:id/restore
 * @param {Object} req.params.id - Recipe ID
 */
export const restoreRecipe = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: formatValidationErrors(errors)
            });
        }

        // Check of recipe bestaat (inclusief deleted)
        const existingRecipe = await Recipe.findById(req.params.id, true);
        if (!existingRecipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe niet gevonden'
            });
        }

        if (!existingRecipe.deleted_at) {
            return res.status(400).json({
                success: false,
                message: 'Recipe is niet verwijderd en kan niet hersteld worden'
            });
        }

        const restoredRecipe = await Recipe.restore(req.params.id);
        
        res.json({
            success: true,
            message: 'Recipe succesvol hersteld',
            data: restoredRecipe
        });
    } catch (error) {
        console.error('Error in restoreRecipe:', error);
        res.status(500).json({
            success: false,
            message: 'Fout bij herstellen van recipe',
            error: error.message
        });
    }
};

/**
 * Haal alle verwijderde recipes op
 * @route GET /api/recipes/deleted
 */
export const getDeletedRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findDeleted();
        
        res.json({
            success: true,
            data: recipes,
            total: recipes.length
        });
    } catch (error) {
        console.error('Error in getDeletedRecipes:', error);
        res.status(500).json({
            success: false,
            message: 'Fout bij ophalen van verwijderde recipes',
            error: error.message
        });
    }
};

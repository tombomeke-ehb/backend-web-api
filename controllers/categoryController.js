import { validationResult } from 'express-validator';
import Category from '../models/Category.js';

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
 * Haal alle categories op met optionele filtering en pagination
 * @route GET /api/categories
 * @param {Object} req.query.limit - Aantal resultaten (default: 50)
 * @param {Object} req.query.offset - Start positie (default: 0)
 * @param {Object} req.query.search - Zoekterm voor naam en beschrijving
 */
export const getAllCategories = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: formatValidationErrors(errors)
            });
        }

        const options = {
            limit: req.query.limit || 50,
            offset: req.query.offset || 0,
            search: req.query.search
        };

        const result = await Category.findAll(options);
        
        res.json({
            success: true,
            data: result.categories,
            pagination: result.pagination
        });
    } catch (error) {
        console.error('Error in getAllCategories:', error);
        res.status(500).json({
            success: false,
            message: 'Fout bij ophalen van categories',
            error: error.message
        });
    }
};

/**
 * Haal een specifieke category op aan de hand van ID
 * @route GET /api/categories/:id
 * @param {Object} req.params.id - Category ID
 */
export const getCategoryById = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: formatValidationErrors(errors)
            });
        }

        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category niet gevonden'
            });
        }

        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error('Error in getCategoryById:', error);
        res.status(500).json({
            success: false,
            message: 'Fout bij ophalen van category',
            error: error.message
        });
    }
};

/**
 * Haal alle recipes op die behoren tot een specifieke category
 * @route GET /api/categories/:id/recipes
 * @param {Object} req.params.id - Category ID
 */
export const getCategoryRecipes = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: formatValidationErrors(errors)
            });
        }

        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category niet gevonden'
            });
        }

        const recipes = await Category.getRecipes(req.params.id);
        
        res.json({
            success: true,
            data: {
                category: category,
                recipes: recipes
            }
        });
    } catch (error) {
        console.error('Error in getCategoryRecipes:', error);
        res.status(500).json({
            success: false,
            message: 'Fout bij ophalen van recipes',
            error: error.message
        });
    }
};

/**
 * Maak een nieuwe category aan in de database
 * Controleert of de naam uniek is voor data integriteit
 * @route POST /api/categories
 * @param {Object} req.body - Category data (name, description)
 */
export const createCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: formatValidationErrors(errors)
            });
        }

        // Check of de naam al bestaat (geavanceerde validatie)
        const exists = await Category.existsByName(req.body.name);
        if (exists) {
            return res.status(400).json({
                success: false,
                message: 'Een category met deze naam bestaat al'
            });
        }

        const newCategory = await Category.create(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Category succesvol aangemaakt',
            data: newCategory
        });
    } catch (error) {
        console.error('Error in createCategory:', error);
        res.status(500).json({
            success: false,
            message: 'Fout bij aanmaken van category',
            error: error.message
        });
    }
};

/**
 * Update een bestaande category
 * Valideert unieke naam constraint
 * @route PUT /api/categories/:id
 * @param {Object} req.params.id - Category ID
 * @param {Object} req.body - Te updaten velden
 */
export const updateCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: formatValidationErrors(errors)
            });
        }

        const existingCategory = await Category.findById(req.params.id);
        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category niet gevonden'
            });
        }

        // Check of de nieuwe naam al bestaat (geavanceerde validatie)
        if (req.body.name) {
            const exists = await Category.existsByName(req.body.name, req.params.id);
            if (exists) {
                return res.status(400).json({
                    success: false,
                    message: 'Een category met deze naam bestaat al'
                });
            }
        }

        const updatedCategory = await Category.update(req.params.id, req.body);
        
        res.json({
            success: true,
            message: 'Category succesvol geüpdatet',
            data: updatedCategory
        });
    } catch (error) {
        console.error('Error in updateCategory:', error);
        res.status(500).json({
            success: false,
            message: 'Fout bij updaten van category',
            error: error.message
        });
    }
};

/**
 * Verwijder een category (soft delete)
 * Voorkomt verwijdering als er nog recipes aan gekoppeld zijn
 * @route DELETE /api/categories/:id
 * @param {Object} req.params.id - Category ID
 */
export const deleteCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: formatValidationErrors(errors)
            });
        }

        const existingCategory = await Category.findById(req.params.id);
        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category niet gevonden'
            });
        }

        // Geavanceerde validatie: check of er recipes zijn die deze category gebruiken
        if (existingCategory.recipe_count > 0) {
            return res.status(400).json({
                success: false,
                message: `Kan category niet verwijderen: er zijn nog ${existingCategory.recipe_count} recipe(s) gekoppeld aan deze category`
            });
        }

        await Category.delete(req.params.id);
        
        res.json({
            success: true,
            message: 'Category succesvol verwijderd (soft delete)'
        });
    } catch (error) {
        console.error('Error in deleteCategory:', error);
        res.status(500).json({
            success: false,
            message: 'Fout bij verwijderen van category',
            error: error.message
        });
    }
};

/**
 * Herstel een verwijderde category
 * @route POST /api/categories/:id/restore
 * @param {Object} req.params.id - Category ID
 */
export const restoreCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: formatValidationErrors(errors)
            });
        }

        // Check of category bestaat (inclusief deleted)
        const existingCategory = await Category.findById(req.params.id, true);
        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: 'Category niet gevonden'
            });
        }

        if (!existingCategory.deleted_at) {
            return res.status(400).json({
                success: false,
                message: 'Category is niet verwijderd en kan niet hersteld worden'
            });
        }

        const restoredCategory = await Category.restore(req.params.id);
        
        res.json({
            success: true,
            message: 'Category succesvol hersteld',
            data: restoredCategory
        });
    } catch (error) {
        console.error('Error in restoreCategory:', error);
        res.status(500).json({
            success: false,
            message: 'Fout bij herstellen van category',
            error: error.message
        });
    }
};

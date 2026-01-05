import { validationResult } from 'express-validator';
import Category from '../models/Category.js';

// Helper functie om validatie errors te formatteren
const formatValidationErrors = (errors) => {
    return errors.array().map(err => ({
        field: err.path,
        message: err.msg
    }));
};

// GET /api/categories - Haal alle categories op
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

// GET /api/categories/:id - Haal één category op
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

// GET /api/categories/:id/recipes - Haal alle recipes van een category op
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

// POST /api/categories - Maak een nieuwe category
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

// PUT /api/categories/:id - Update een category
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

// DELETE /api/categories/:id - Verwijder een category
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
            message: 'Category succesvol verwijderd'
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

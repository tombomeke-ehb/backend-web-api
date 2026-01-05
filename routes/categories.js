/**
 * Category Routes
 * Definieert alle HTTP endpoints voor category CRUD operaties
 * Bevat extra endpoint voor het ophalen van recipes per category
 */

import express from 'express';
import {
    getAllCategories,
    getCategoryById,
    getCategoryRecipes,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import {
    listCategoriesValidation,
    getCategoryValidation,
    createCategoryValidation,
    updateCategoryValidation,
    deleteCategoryValidation
} from '../validators/categoryValidators.js';

const router = express.Router();

// GET /api/categories - Lijst van alle categories (met pagination en search)
router.get('/', listCategoriesValidation, getAllCategories);

// GET /api/categories/:id - Details van één category
router.get('/:id', getCategoryValidation, getCategoryById);

// GET /api/categories/:id/recipes - Alle recipes van een category
router.get('/:id/recipes', getCategoryValidation, getCategoryRecipes);

// POST /api/categories - Maak een nieuwe category
router.post('/', createCategoryValidation, createCategory);

// PUT /api/categories/:id - Update een category
router.put('/:id', updateCategoryValidation, updateCategory);

// DELETE /api/categories/:id - Verwijder een category
router.delete('/:id', deleteCategoryValidation, deleteCategory);

export default router;

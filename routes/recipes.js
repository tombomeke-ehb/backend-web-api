/**
 * Recipe Routes
 * Definieert alle HTTP endpoints voor recipe CRUD operaties
 * Elke route heeft validatie middleware voor input verificatie
 */

import express from 'express';
import {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    restoreRecipe,
    getDeletedRecipes
} from '../controllers/recipeController.js';
import {
    listRecipesValidation,
    getRecipeValidation,
    createRecipeValidation,
    updateRecipeValidation,
    deleteRecipeValidation
} from '../validators/recipeValidators.js';

const router = express.Router();

// GET /api/recipes/deleted - Lijst van verwijderde recipes (moet voor /:id route)
router.get('/deleted', getDeletedRecipes);

// GET /api/recipes - Lijst van alle recipes (met pagination, search, filtering, sorting)
router.get('/', listRecipesValidation, getAllRecipes);

// GET /api/recipes/:id - Details van één recipe
router.get('/:id', getRecipeValidation, getRecipeById);

// POST /api/recipes - Maak een nieuwe recipe
router.post('/', createRecipeValidation, createRecipe);

// POST /api/recipes/:id/restore - Herstel een verwijderde recipe
router.post('/:id/restore', getRecipeValidation, restoreRecipe);

// PUT /api/recipes/:id - Update een recipe
router.put('/:id', updateRecipeValidation, updateRecipe);

// DELETE /api/recipes/:id - Verwijder een recipe (soft delete)
router.delete('/:id', deleteRecipeValidation, deleteRecipe);

export default router;

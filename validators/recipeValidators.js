import { body, query, param } from 'express-validator';

// Basisvalidatie regels voor recipes
// Bron: https://express-validator.github.io/docs/guides/getting-started
export const createRecipeValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Titel is verplicht')
        .isLength({ min: 3, max: 200 }).withMessage('Titel moet tussen 3 en 200 karakters zijn')
        .matches(/^[a-zA-Z0-9\s\-,.'éèêëàâäôöûüïî]+$/).withMessage('Titel mag alleen letters, cijfers en basis leestekens bevatten'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Beschrijving mag maximaal 1000 karakters zijn'),
    
    body('ingredients')
        .trim()
        .notEmpty().withMessage('Ingrediënten zijn verplicht')
        .isLength({ min: 10 }).withMessage('Ingrediënten moet minimaal 10 karakters zijn'),
    
    body('instructions')
        .trim()
        .notEmpty().withMessage('Instructies zijn verplicht')
        .isLength({ min: 20 }).withMessage('Instructies moet minimaal 20 karakters zijn'),
    
    body('prep_time')
        .notEmpty().withMessage('Bereidingstijd is verplicht')
        .isInt({ min: 0, max: 1440 }).withMessage('Bereidingstijd moet een getal zijn tussen 0 en 1440 minuten'),
    
    body('cook_time')
        .notEmpty().withMessage('Kooktijd is verplicht')
        .isInt({ min: 0, max: 1440 }).withMessage('Kooktijd moet een getal zijn tussen 0 en 1440 minuten'),
    
    body('servings')
        .notEmpty().withMessage('Aantal porties is verplicht')
        .isInt({ min: 1, max: 100 }).withMessage('Aantal porties moet een getal zijn tussen 1 en 100'),
    
    body('difficulty')
        .optional()
        .isIn(['easy', 'medium', 'hard']).withMessage('Moeilijkheidsgraad moet easy, medium of hard zijn'),
    
    body('category_id')
        .optional()
        .isInt({ min: 1 }).withMessage('Category ID moet een positief getal zijn'),
    
    // Geavanceerde validatie: totale tijd moet realistisch zijn
    body().custom((value) => {
        const prepTime = parseInt(value.prep_time);
        const cookTime = parseInt(value.cook_time);
        const totalTime = prepTime + cookTime;
        
        if (totalTime < 1) {
            throw new Error('Totale bereidingstijd moet minimaal 1 minuut zijn');
        }
        
        return true;
    })
];

export const updateRecipeValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('Recipe ID moet een positief getal zijn'),
    
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 }).withMessage('Titel moet tussen 3 en 200 karakters zijn')
        .matches(/^[a-zA-Z0-9\s\-,.'éèêëàâäôöûüïî]+$/).withMessage('Titel mag alleen letters, cijfers en basis leestekens bevatten'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Beschrijving mag maximaal 1000 karakters zijn'),
    
    body('ingredients')
        .optional()
        .trim()
        .isLength({ min: 10 }).withMessage('Ingrediënten moet minimaal 10 karakters zijn'),
    
    body('instructions')
        .optional()
        .trim()
        .isLength({ min: 20 }).withMessage('Instructies moet minimaal 20 karakters zijn'),
    
    body('prep_time')
        .optional()
        .isInt({ min: 0, max: 1440 }).withMessage('Bereidingstijd moet een getal zijn tussen 0 en 1440 minuten'),
    
    body('cook_time')
        .optional()
        .isInt({ min: 0, max: 1440 }).withMessage('Kooktijd moet een getal zijn tussen 0 en 1440 minuten'),
    
    body('servings')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Aantal porties moet een getal zijn tussen 1 en 100'),
    
    body('difficulty')
        .optional()
        .isIn(['easy', 'medium', 'hard']).withMessage('Moeilijkheidsgraad moet easy, medium of hard zijn'),
    
    body('category_id')
        .optional()
        .isInt({ min: 1 }).withMessage('Category ID moet een positief getal zijn')
];

export const deleteRecipeValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('Recipe ID moet een positief getal zijn')
];

export const getRecipeValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('Recipe ID moet een positief getal zijn')
];

// Validatie voor pagination en search
export const listRecipesValidation = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit moet een getal zijn tussen 1 en 100'),
    
    query('offset')
        .optional()
        .isInt({ min: 0 }).withMessage('Offset moet een positief getal of 0 zijn'),
    
    query('search')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Zoekterm moet tussen 2 en 100 karakters zijn'),
    
    query('difficulty')
        .optional()
        .isIn(['easy', 'medium', 'hard']).withMessage('Difficulty moet easy, medium of hard zijn'),
    
    query('category_id')
        .optional()
        .isInt({ min: 1 }).withMessage('Category ID moet een positief getal zijn'),
    
    query('sort')
        .optional()
        .isIn(['title', 'prep_time', 'cook_time', 'created_at', 'servings']).withMessage('Sort veld is ongeldig'),
    
    query('order')
        .optional()
        .isIn(['asc', 'desc']).withMessage('Order moet asc of desc zijn')
];

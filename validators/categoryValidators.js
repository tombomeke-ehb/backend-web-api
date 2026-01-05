import { body, query, param } from 'express-validator';

// Validatie voor het aanmaken van een category
export const createCategoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Naam is verplicht')
        .isLength({ min: 2, max: 100 }).withMessage('Naam moet tussen 2 en 100 karakters zijn')
        .matches(/^[a-zA-Z\s\-éèêëàâäôöûüïî]+$/).withMessage('Naam mag alleen letters en spaties bevatten'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Beschrijving mag maximaal 500 karakters zijn')
];

// Validatie voor het updaten van een category
export const updateCategoryValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('Category ID moet een positief getal zijn'),
    
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Naam moet tussen 2 en 100 karakters zijn')
        .matches(/^[a-zA-Z\s\-éèêëàâäôöûüïî]+$/).withMessage('Naam mag alleen letters en spaties bevatten'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Beschrijving mag maximaal 500 karakters zijn')
];

// Validatie voor het ophalen van een category
export const getCategoryValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('Category ID moet een positief getal zijn')
];

// Validatie voor het verwijderen van een category
export const deleteCategoryValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('Category ID moet een positief getal zijn')
];

// Validatie voor lijst van categories
export const listCategoriesValidation = [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit moet een getal zijn tussen 1 en 100'),
    
    query('offset')
        .optional()
        .isInt({ min: 0 }).withMessage('Offset moet een positief getal of 0 zijn'),
    
    query('search')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Zoekterm moet tussen 2 en 100 karakters zijn')
];

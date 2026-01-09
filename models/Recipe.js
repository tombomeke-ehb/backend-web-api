import dbPromise from '../config/database.sqlite.js';

/**
 * Recipe Model
 * Beheert alle database operaties voor recipes
 * Implementeert CRUD operaties met filtering, pagination en sorting
 * Ondersteunt soft delete (data markeren als verwijderd i.p.v. permanent verwijderen)
 */
class Recipe {
    // Hard delete: verwijder recipe permanent uit de database
    static async hardDelete(id) {
        const db = await dbPromise;
        const result = await db.run('DELETE FROM recipes WHERE id = ?', id);
        return result.changes > 0;
    }

    /**
     * Haal alle recipes op met optionele filters, pagination en sorting
     * Ondersteunt multi-field search als extra feature
     * Filtert automatisch soft-deleted items uit tenzij expliciet gevraagd
     * @param {Object} options - Query opties
     * @param {number} options.limit - Aantal resultaten (default: 10)
     * @param {number} options.offset - Start positie (default: 0)
     * @param {string} options.search - Zoekterm voor meerdere velden
     * @param {string} options.difficulty - Filter op moeilijkheidsgraad
     * @param {number} options.category_id - Filter op category
     * @param {string} options.sort - Sorteer veld (default: created_at)
     * @param {string} options.order - Sorteer richting asc/desc (default: desc)
     * @param {boolean} options.includeDeleted - Toon ook verwijderde items (default: false)
     * @returns {Object} Object met recipes array en pagination metadata
     */
    static async findAll(options = {}) {
        const db = await dbPromise;
        const allowedSortFields = ['title', 'prep_time', 'cook_time', 'created_at', 'servings', 'total_time'];
        const {
            limit = 10,
            offset = 0,
            search = null,
            difficulty = null,
            category_id = null,
            sort = 'created_at',
            order = 'desc',
            includeDeleted = false
        } = options;

        let query = `
            SELECT r.*, c.name as category_name 
            FROM recipes r
            LEFT JOIN categories c ON r.category_id = c.id
            WHERE 1=1
        `;
        const params = [];

        // Filter soft-deleted items (tenzij expliciet gevraagd)
        if (!includeDeleted) {
            query += ` AND r.deleted_at IS NULL`;
        }

        // Search in meerdere velden (extra feature)
        if (search) {
            query += ` AND (r.title LIKE ? OR r.description LIKE ? OR r.ingredients LIKE ?)`;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        if (difficulty) {
            query += ` AND r.difficulty = ?`;
            params.push(difficulty);
        }

        if (category_id) {
            query += ` AND r.category_id = ?`;
            params.push(category_id);
        }

        // Sorting (extra feature)
        let sortField = allowedSortFields.includes(sort) ? sort : 'created_at';
        const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

        if (sortField === 'title') {
            // Case-insensitive, NOCASE sortering
            query += ` ORDER BY LOWER(r.title) COLLATE NOCASE ${sortOrder}`;
        } else if (sortField === 'total_time') {
            // Sorteer op som van prep_time + cook_time, gebruik COALESCE om null te voorkomen
            query += ` ORDER BY (COALESCE(r.prep_time,0) + COALESCE(r.cook_time,0)) ${sortOrder}`;
        } else {
            query += ` ORDER BY r.${sortField} ${sortOrder}`;
        }
        query += ` LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const rows = await db.all(query, params);

        // Tel totaal aantal resultaten voor pagination info
        let countQuery = `SELECT COUNT(*) as total FROM recipes r WHERE 1=1`;
        const countParams = [];

        if (!includeDeleted) {
            countQuery += ` AND r.deleted_at IS NULL`;
        }

        if (search) {
            countQuery += ` AND (r.title LIKE ? OR r.description LIKE ? OR r.ingredients LIKE ?)`;
            const searchTerm = `%${search}%`;
            countParams.push(searchTerm, searchTerm, searchTerm);
        }
        if (difficulty) {
            countQuery += ` AND r.difficulty = ?`;
            countParams.push(difficulty);
        }
        if (category_id) {
            countQuery += ` AND r.category_id = ?`;
            countParams.push(category_id);
        }

        const countRow = await db.get(countQuery, countParams);
        const total = countRow ? countRow.total : 0;

        return {
            recipes: rows,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                returned: rows.length
            }
        };
    }

    /**
     * Vind een specifieke recipe op basis van ID
     * @param {number} id - Recipe ID
     * @param {boolean} includeDeleted - Toon ook verwijderde items
     * @returns {Object|undefined} Recipe object of undefined als niet gevonden
     */
    static async findById(id, includeDeleted = false) {
        const db = await dbPromise;
        let query = `
            SELECT r.*, c.name as category_name 
            FROM recipes r
            LEFT JOIN categories c ON r.category_id = c.id
            WHERE r.id = ?
        `;
        
        if (!includeDeleted) {
            query += ` AND r.deleted_at IS NULL`;
        }
        
        const row = await db.get(query, [id]);
        return row;
    }

    /**
     * Maak een nieuwe recipe aan in de database
     * @param {Object} recipeData - Recipe data object
     * @returns {Object} Nieuw aangemaakte recipe met gegenereerde ID
     */
    static async create(recipeData) {
        const db = await dbPromise;
        const query = `
            INSERT INTO recipes (title, description, ingredients, instructions, prep_time, cook_time, servings, difficulty, category_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            recipeData.title,
            recipeData.description || null,
            recipeData.ingredients,
            recipeData.instructions,
            recipeData.prep_time,
            recipeData.cook_time,
            recipeData.servings,
            recipeData.difficulty || 'medium',
            recipeData.category_id || null
        ];

        const result = await db.run(query, values);
        return this.findById(result.lastID);
    }

    /**
     * Update een bestaande recipe
     * Bouwt dynamisch een UPDATE query op basis van meegegeven velden
     * @param {number} id - Recipe ID
     * @param {Object} recipeData - Te updaten velden
     * @returns {Object} Geüpdatete recipe
     */
    static async update(id, recipeData) {
        const db = await dbPromise;
        const fields = [];
        const values = [];

        // Dynamisch query bouwen voor alleen de velden die meegegeven zijn
        Object.keys(recipeData).forEach(key => {
            if (recipeData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(recipeData[key]);
            }
        });

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        const query = `UPDATE recipes SET ${fields.join(', ')} WHERE id = ?`;
        
        await db.run(query, values);
        return this.findById(id);
    }

    /**
     * Verwijder een recipe (soft delete)
     * Markeert de recipe als verwijderd zonder data permanent te verwijderen
     * @param {number} id - Recipe ID
     * @returns {boolean} True als verwijderd, false als niet gevonden
     */
    static async delete(id) {
        const db = await dbPromise;
        const now = new Date().toISOString();
        const result = await db.run(`UPDATE recipes SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL`, [now, id]);
        return result.changes > 0;
    }

    /**
     * Herstel een soft-deleted recipe
     * @param {number} id - Recipe ID
     * @returns {Object|null} Herstelde recipe of null als niet gevonden
     */
    static async restore(id) {
        const db = await dbPromise;
        const result = await db.run(`UPDATE recipes SET deleted_at = NULL WHERE id = ?`, [id]);
        
        if (result.changes > 0) {
            return this.findById(id);
        }
        return null;
    }

    /**
     * Permanent verwijderen van een recipe (hard delete)
     * Gebruik met voorzichtigheid - data kan niet worden hersteld
     * @param {number} id - Recipe ID
     * @returns {boolean} True als verwijderd
     */
    static async hardDelete(id) {
        const db = await dbPromise;
        const result = await db.run('DELETE FROM recipes WHERE id = ?', id);
        return result.changes > 0;
    }

    /**
     * Haal alle soft-deleted recipes op
     * @returns {Array} Array van verwijderde recipes
     */
    static async findDeleted() {
        const db = await dbPromise;
        const query = `
            SELECT r.*, c.name as category_name 
            FROM recipes r
            LEFT JOIN categories c ON r.category_id = c.id
            WHERE r.deleted_at IS NOT NULL
            ORDER BY r.deleted_at DESC
        `;
        const rows = await db.all(query);
        return rows;
    }
}

export default Recipe;

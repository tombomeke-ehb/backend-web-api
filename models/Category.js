import db from '../config/database.js';

/**
 * Category Model
 * Beheert alle database operaties voor categories
 * Implementeert CRUD operaties met recipe counting
 * Ondersteunt soft delete (data markeren als verwijderd i.p.v. permanent verwijderen)
 */
class Category {
    /**
     * Haal alle categories op met optionele filtering en pagination
     * Bevat recipe_count voor elke category (JOIN query)
     * Filtert automatisch soft-deleted items uit
     * @param {Object} options - Query opties
     * @param {number} options.limit - Aantal resultaten (default: 50)
     * @param {number} options.offset - Start positie (default: 0)
     * @param {string} options.search - Zoekterm voor naam en beschrijving
     * @param {boolean} options.includeDeleted - Toon ook verwijderde items (default: false)
     * @returns {Object} Object met categories array en pagination metadata
     */
    static async findAll(options = {}) {
        const {
            limit = 50,
            offset = 0,
            search = null,
            includeDeleted = false
        } = options;

        let query = `
            SELECT c.*, COUNT(r.id) as recipe_count
            FROM categories c
            LEFT JOIN recipes r ON c.id = r.category_id AND r.deleted_at IS NULL
            WHERE 1=1
        `;
        const params = [];

        // Filter soft-deleted categories
        if (!includeDeleted) {
            query += ` AND c.deleted_at IS NULL`;
        }

        // Search in naam en beschrijving
        if (search) {
            query += ` AND (c.name LIKE ? OR c.description LIKE ?)`;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm);
        }

        query += ` GROUP BY c.id ORDER BY c.name ASC`;
        query += ` LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const [rows] = await db.query(query, params);
        
        // Tel totaal aantal categories
        let countQuery = `SELECT COUNT(*) as total FROM categories WHERE 1=1`;
        const countParams = [];
        
        if (!includeDeleted) {
            countQuery += ` AND deleted_at IS NULL`;
        }
        
        if (search) {
            countQuery += ` AND (name LIKE ? OR description LIKE ?)`;
            const searchTerm = `%${search}%`;
            countParams.push(searchTerm, searchTerm);
        }
        
        const [countResult] = await db.query(countQuery, countParams);
        const total = countResult[0].total;

        return {
            categories: rows,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                returned: rows.length
            }
        };
    }

    /**
     * Vind een specifieke category op basis van ID
     * @param {number} id - Category ID
     * @param {boolean} includeDeleted - Toon ook verwijderde items
     * @returns {Object|undefined} Category object met recipe_count of undefined
     */
    static async findById(id, includeDeleted = false) {
        let query = `
            SELECT c.*, COUNT(r.id) as recipe_count
            FROM categories c
            LEFT JOIN recipes r ON c.id = r.category_id AND r.deleted_at IS NULL
            WHERE c.id = ?
        `;
        
        if (!includeDeleted) {
            query += ` AND c.deleted_at IS NULL`;
        }
        
        query += ` GROUP BY c.id`;
        
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    /**
     * Haal alle recipes op die behoren tot een category
     * Filtert soft-deleted recipes uit
     * @param {number} id - Category ID
     * @returns {Array} Array van recipe objecten
     */
    static async getRecipes(id) {
        const query = `
            SELECT r.*
            FROM recipes r
            WHERE r.category_id = ? AND r.deleted_at IS NULL
            ORDER BY r.created_at DESC
        `;
        const [rows] = await db.query(query, [id]);
        return rows;
    }

    /**
     * Maak een nieuwe category aan in de database
     * @param {Object} categoryData - Category data object
     * @returns {Object} Nieuw aangemaakte category met gegenereerde ID
     */
    static async create(categoryData) {
        const query = `
            INSERT INTO categories (name, description)
            VALUES (?, ?)
        `;
        const values = [
            categoryData.name,
            categoryData.description || null
        ];

        const [result] = await db.query(query, values);
        return this.findById(result.insertId);
    }

    /**
     * Update een bestaande category
     * Bouwt dynamisch een UPDATE query op basis van meegegeven velden
     * @param {number} id - Category ID
     * @param {Object} categoryData - Te updaten velden
     * @returns {Object} Geüpdatete category
     */
    static async update(id, categoryData) {
        const fields = [];
        const values = [];

        // Dynamisch query bouwen voor alleen de velden die meegegeven zijn
        Object.keys(categoryData).forEach(key => {
            if (categoryData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(categoryData[key]);
            }
        });

        if (fields.length === 0) {
            return this.findById(id);
        }

        values.push(id);
        const query = `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`;
        
        await db.query(query, values);
        return this.findById(id);
    }

    /**
     * Verwijder een category (soft delete)
     * Markeert de category als verwijderd zonder data permanent te verwijderen
     * @param {number} id - Category ID
     * @returns {boolean} True als verwijderd, false als niet gevonden
     */
    static async delete(id) {
        const query = `UPDATE categories SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL`;
        const [result] = await db.query(query, [id]);
        return result.affectedRows > 0;
    }

    /**
     * Herstel een soft-deleted category
     * @param {number} id - Category ID
     * @returns {Object|null} Herstelde category of null als niet gevonden
     */
    static async restore(id) {
        const query = `UPDATE categories SET deleted_at = NULL WHERE id = ?`;
        const [result] = await db.query(query, [id]);
        
        if (result.affectedRows > 0) {
            return this.findById(id);
        }
        return null;
    }

    /**
     * Controleer of een category naam al bestaat in de database
     * Gebruikt voor unieke naam validatie
     * @param {string} name - Category naam om te controleren
     * @param {number} excludeId - Optioneel: ID om uit te sluiten (voor updates)
     * @returns {boolean} True als naam al bestaat, false als uniek
     */
    static async existsByName(name, excludeId = null) {
        let query = `SELECT id FROM categories WHERE name = ? AND deleted_at IS NULL`;
        const params = [name];
        
        if (excludeId) {
            query += ` AND id != ?`;
            params.push(excludeId);
        }
        
        const [rows] = await db.query(query, params);
        return rows.length > 0;
    }
}

export default Category;

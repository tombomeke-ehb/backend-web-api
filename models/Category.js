import db from '../config/database.js';

class Category {
    // Haal alle categories op met optionele filters en pagination
    static async findAll(options = {}) {
        const {
            limit = 50,
            offset = 0,
            search = null
        } = options;

        let query = `
            SELECT c.*, COUNT(r.id) as recipe_count
            FROM categories c
            LEFT JOIN recipes r ON c.id = r.category_id
            WHERE 1=1
        `;
        const params = [];

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

    // Vind één category op ID
    static async findById(id) {
        const query = `
            SELECT c.*, COUNT(r.id) as recipe_count
            FROM categories c
            LEFT JOIN recipes r ON c.id = r.category_id
            WHERE c.id = ?
            GROUP BY c.id
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    // Haal alle recipes van een category op
    static async getRecipes(id) {
        const query = `
            SELECT r.*
            FROM recipes r
            WHERE r.category_id = ?
            ORDER BY r.created_at DESC
        `;
        const [rows] = await db.query(query, [id]);
        return rows;
    }

    // Maak een nieuwe category
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

    // Update een bestaande category
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

    // Verwijder een category
    static async delete(id) {
        const query = `DELETE FROM categories WHERE id = ?`;
        const [result] = await db.query(query, [id]);
        return result.affectedRows > 0;
    }

    // Check of een category naam al bestaat
    static async existsByName(name, excludeId = null) {
        let query = `SELECT id FROM categories WHERE name = ?`;
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

const { query } = require('../db/connection');

const ingredientModel = {
    // Add a new ingredient
    create: async (ingredient_name, quantity, unit) => {
        const sql = `
            INSERT INTO ingredients (ingredient_name, quantity, unit)
            VALUES ($1, $2, $3)
            RETURNING *`;
        const values = [ingredient_name, quantity, unit];
        return await query(sql, values);
    },

    // Update an existing ingredient
    update: async (id, ingredient_name, quantity, unit) => {
        const sql = `
            UPDATE ingredients 
            SET ingredient_name = $2, quantity = $3, unit = $4
            WHERE id = $1
            RETURNING *`;
        const values = [id, ingredient_name, quantity, unit];
        return await query(sql, values);
    }
};

module.exports = ingredientModel;

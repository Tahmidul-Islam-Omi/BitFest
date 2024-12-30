const { pool } = require('../db/connection');

const chatBotModel = {
    getAvailableIngredients: async () => {
        try {
            const query = `
                SELECT i.ingredient_name, i.quantity, i.unit 
                FROM ingredients i 
                WHERE i.quantity > 0
            `;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error fetching ingredients:', error);
            throw error;
        }
    },

    getRecipes: async () => {
        try {
            const query = `
                SELECT 
                    r.recipe_id,
                    r.name,
                    r.cuisine,
                    r.preparation_time_in_min,
                    r.instructions,
                    STRING_AGG(i.ingredient_name, ', ') as ingredients
                FROM recipes r
                LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
                LEFT JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
                GROUP BY r.recipe_id, r.name, r.cuisine, r.preparation_time_in_min, r.instructions
            `;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error fetching recipes:', error);
            throw error;
        }
    }
};

module.exports = chatBotModel;

const { query } = require('../db/connection');

const recipeExportModel = {
    // Get all recipes
    getAllRecipes: async () => {
        const sql = 'SELECT * FROM recipes';
        const result = await query(sql);
        return result.rows || result;
    }
};

module.exports = recipeExportModel;

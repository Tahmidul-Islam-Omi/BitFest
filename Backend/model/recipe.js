const { query } = require('../db/connection');

const recipeModel = {
    // Add a new recipe
    create: async (name, cuisine, preparation_time_in_min, instructions) => {
        const sql = `
            INSERT INTO recipes (name, cuisine, preparation_time_in_min, instructions)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;
        const values = [name, cuisine, preparation_time_in_min, instructions];
        return await query(sql, values);
    }
};

module.exports = recipeModel;

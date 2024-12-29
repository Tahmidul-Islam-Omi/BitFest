const recipeModel = require('../model/recipe');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const recipeController = {
    addRecipe: catchAsync(async (req, res) => {
        const { name, cuisine, preparation_time_in_min, instructions } = req.body;
        console.log(req.body);
        
        // Validation
        if (!name || !cuisine || !preparation_time_in_min || !instructions) {
            throw new AppError('Missing required fields', 400);
        }

        const result = await recipeModel.create(name, cuisine, preparation_time_in_min, instructions);
        
        res.status(201).json({
            status: 'success',
            data: result.rows[0]
        });
    })
};

module.exports = recipeController;

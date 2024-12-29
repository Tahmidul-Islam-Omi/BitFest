const ingredientModel = require('../model/ingredient');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const ingredientController = {
    addIngredient: catchAsync(async (req, res) => {
        const { ingredient_name, quantity, unit } = req.body;
        console.log(req.body);
        
        // Validation
        if (!ingredient_name || !quantity || !unit) {
            throw new AppError('Missing required fields', 400);
        }

        const result = await ingredientModel.create(ingredient_name, quantity, unit);
        
        res.status(201).json({
            status: 'success',
            data: result.rows[0]
        });
    }),

    updateIngredient: catchAsync(async (req, res) => {
        const { ingredient_id, ingredient_name, quantity, unit } = req.body;

        if (!ingredient_id) {
            throw new AppError('Ingredient ID is required', 400);
        }

        const result = await ingredientModel.update(ingredient_id, ingredient_name, quantity, unit);

        if (result.rowCount === 0) {
            throw new AppError('Ingredient not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: result.rows[0]
        });
    })
};

module.exports = ingredientController;

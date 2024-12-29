const recipeModel = require('../model/recipe');
const multer = require('multer');
const ocrService = require('../service/ocrService');
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
    }),
    uploadRecipeImage: catchAsync(async (req, res) => {
        if (!req.file) {
            throw new AppError('No image file provided', 400);
        }

        const extractedText = await ocrService.extractTextFromImage(req.file.buffer);
        
        // Parse the extracted text
        const parseRecipeText = (text) => {
            const name = text.match(/Name:\s*(.*?)(?:\n|$)/)?.[1]?.trim();
            const cuisine = text.match(/Cuisine:\s*(.*?)(?:\n|$)/)?.[1]?.trim();
            const prepTime = text.match(/Preparation_Time_in_Min:\s*(\d+)/)?.[1];
            const instructions = text.match(/Instructions:\s*([\s\S]*?)$/)?.[1]?.trim();

            return {
                name,
                cuisine,
                preparation_time_in_min: parseInt(prepTime),
                instructions
            };
        };

        const recipeData = parseRecipeText(extractedText);

        // Validate parsed data
        if (!recipeData.name || !recipeData.cuisine || 
            !recipeData.preparation_time_in_min || !recipeData.instructions) {
            throw new AppError('Could not extract all required recipe information from image', 400);
        }

        // Save to database
        const result = await recipeModel.create(
            recipeData.name,
            recipeData.cuisine,
            recipeData.preparation_time_in_min,
            recipeData.instructions
        );

        res.status(200).json({
            status: 'success',
            data: {
                message: 'Recipe extracted and saved successfully',
                recipe: result.rows[0]
            }
        });
    })
};

module.exports = recipeController;

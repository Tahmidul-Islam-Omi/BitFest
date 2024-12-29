const fs = require('fs').promises;
const path = require('path');
const RecipeExport = require('../model/recipeExport');
const catchAsync = require('../utils/catchAsync');

class RecipeExportService {
    static exportRecipes = catchAsync(async () => {
        // Create data directory if it doesn't exist
        const dataDir = path.join(__dirname, '../data');
        await fs.mkdir(dataDir, { recursive: true });

        // Fetch all recipes from database using the model
        const recipes = await RecipeExport.getAllRecipes();

        // Check if recipes is an array
        if (!Array.isArray(recipes)) {
            throw new Error('Expected recipes to be an array');
        }

        // Format recipes for text file
        const recipeText = recipes.map(recipe => {
            return `Recipe: ${recipe.name}\n` +
                `Ingredients: ${recipe.ingredients}\n` +
                `Instructions: ${recipe.instructions}\n` +
                '-'.repeat(50) + '\n\n';
        }).join('');

        // Write to file
        const filePath = path.join(dataDir, 'my_fav_recipes.txt');
        await fs.writeFile(filePath, recipeText, 'utf-8');

        console.log(`Successfully exported ${recipes.length} recipes to my_fav_recipes.txt`);
    });
}

module.exports = RecipeExportService; 
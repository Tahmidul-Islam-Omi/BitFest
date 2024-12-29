const { GoogleGenerativeAI } = require('@google/generative-ai');
const { pool } = require('../db/connection');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs').promises;
const path = require('path');

class ChatbotService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    async getAvailableIngredients() {
        const query = `
            SELECT i.ingredient_name, i.quantity, i.unit 
            FROM ingredients i 
            WHERE i.quantity > 0
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    async getRecipesFromDB() {
        const query = `
            SELECT r.name, r.cuisine, r.preparation_time_in_min, r.instructions,
                   STRING_AGG(i.ingredient_name, ', ') as ingredients
            FROM recipes r
            LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
            LEFT JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
            GROUP BY r.recipe_id
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    generatePrompt = async (userMessage) => {
        const ingredients = await this.getAvailableIngredients();
        const recipes = await this.getRecipesFromDB();
        
        return `
        You are a cooking assistant. Your task is to help suggest recipes based on:
        1. Available ingredients: ${JSON.stringify(ingredients)}
        2. Saved recipes: ${JSON.stringify(recipes)}
        3. User preference: "${userMessage}"

        Please provide:
        1. Recipe suggestions that can be made with available ingredients
        2. List any missing ingredients that need to be bought
        3. Cooking instructions if it matches a saved recipe
        4. Estimated preparation time

        Format your response in a clear, structured way.
        `;
    }

    chat = catchAsync(async (userMessage) => {
        const prompt = await this.generatePrompt(userMessage);
        
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        
        return response.text();
    });
}

module.exports = new ChatbotService();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const chatBotModel = require('../model/chatBot');

class ChatbotService {
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            throw new AppError('GEMINI_API_KEY is not defined in environment variables', 500);
        }
        
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    generatePrompt = catchAsync(async (userMessage) => {
        const ingredients = await chatBotModel.getAvailableIngredients();
        const recipes = await chatBotModel.getRecipes();

        if (!ingredients || !recipes) {
            throw new AppError('Failed to fetch data from database', 500);
        }

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
    });

    chat = catchAsync(async (userMessage) => {
        const prompt = await this.generatePrompt(userMessage);
        console.log('Sending prompt to Gemini:', prompt);

        const result = await this.model.generateContent([
            {
                text: prompt
            }
        ]);
        
        if (!result || !result.response) {
            throw new AppError('No response received from Gemini API', 502);
        }

        const response = await result.response;
        const text = response.text();
        
        console.log('Received response from Gemini:', text);
        
        if (!text) {
            throw new AppError('Empty response from Gemini API', 502);
        }

        return {
            suggestion: text,
            ingredients: await chatBotModel.getAvailableIngredients(),
            timestamp: new Date().toISOString()
        };
    });
}

module.exports = new ChatbotService();

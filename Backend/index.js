const express = require('express');
const config = require('./config/config');
const { pool } = require('./db/connection');
const RecipeExportService = require('./service/recipeExportService');
const app = express();

const ingredientRoutes = require('./route/ingredient');
const recipeRoutes = require('./route/recipe');
const chatbotRoutes = require('./route/chatbot');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/errorHandler');

// Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

// routes
app.use('/api/v1', ingredientRoutes);
app.use('/api/v1', recipeRoutes);
app.use('/api/v1/chatbot', chatbotRoutes); 

// Error handling middleware (should be last)
app.use(errorHandler);

// Ensure database connection and start the server
pool.connect(async (err, client, release) => {
    if (err) {
        console.error('Failed to connect to the database:', err.stack);
        process.exit(1);
    } else {
        console.log('Database connected successfully!');
        
        // Export recipes on server start
        await RecipeExportService.exportRecipes();
        
        app.listen(config.port, () => {
            console.log(`Server is running on http://localhost:${config.port}`);
        });
    }
});

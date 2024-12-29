const express = require('express');
const router = express.Router();
const { rateLimit } = require('express-rate-limit');
const multer = require('multer');
const upload = multer();
const uploadSingle = upload.single('recipe_image');
const config = require('../config/config');
const recipeController = require('../controller/recipe');

const recipeRateLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again later'
    }
});

router
    .route('/recipe')
    .put(recipeRateLimiter, recipeController.addRecipe);

router
    .route('/upload-recipe-image')
    .post(uploadSingle, recipeController.uploadRecipeImage);

module.exports = router;
const express = require('express');
const router = express.Router();
const { rateLimit } = require('express-rate-limit');
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


module.exports = router;
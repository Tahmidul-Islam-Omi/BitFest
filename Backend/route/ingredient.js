const express = require('express');
const router = express.Router();
const { rateLimit } = require('express-rate-limit');
const config = require('../config/config');
const ingredientController = require('../controller/ingredient');

const ingredientRateLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again later'
    }
});

router
    .route('/ingredients')
    .post(ingredientRateLimiter, ingredientController.addIngredient);

router
    .route('/ingredients/:id')
    .put(ingredientRateLimiter, ingredientController.updateIngredient);

module.exports = router;
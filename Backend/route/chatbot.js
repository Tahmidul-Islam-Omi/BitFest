const express = require('express');
const router = express.Router();
const { rateLimit } = require('express-rate-limit');
const config = require('../config/config');
const chatbotController = require('../controller/chatbotController');

const chatLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again later'
    }
});

router.post('/chat', chatLimiter , chatbotController.chat);

module.exports = router;

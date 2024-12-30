const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const chatbotService = require('../service/chatbotService');

const chatbotController = {
    chat: catchAsync(async (req, res, next) => {
        const { message } = req.body;
        
        if (!message) {
            throw new AppError('Message is required', 400);
        }

        const response = await chatbotService.chat(message);
        
        if (!response) {
            throw new AppError('No response from chatbot service', 503);
        }

        res.status(200).json({
            status: 'success',
            data: response
        });
    })
};

module.exports = chatbotController;

const catchAsync = require('../utils/catchAsync');
const chatbotService = require('../service/chatbotService');

const chatbotController = {
    chat: catchAsync(async (req, res) => {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({
                status: 'error',
                message: 'Message is required'
            });
        }

        const response = await chatbotService.chat(message);
        
        res.status(200).json({
            status: 'success',
            data: {
                response
            }
        });
    })
};

module.exports = chatbotController;

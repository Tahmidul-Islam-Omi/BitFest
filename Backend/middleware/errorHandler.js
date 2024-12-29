const config = require('../config/config');

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack);

    const status = err.statusCode || 500;
    res.status(status).json({
        status: 'error',
        message: err.message || 'Internal server error',
        ...(config.nodeEnv === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
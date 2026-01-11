import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    res.status(err.status || 500).json({
        error: "Internal Server Error",
        details: process.env.NODE_ENV === 'production' ? "Something went wrong." : err.message
    });
};

export default errorHandler;

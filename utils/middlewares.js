const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')

    next()
}
const errorHandler = (error, req, res, next) => {
    logger.error(error.message)
    if (error.name === 'CastError'){
        // use status() not statusCode()
        return res.status(400).send({error: 'malformed id!'})
    }else if (error.name === 'ValidationError'){
        return res.status(400).json({error: error.message})
    }
    next(error)
}

// middleware after route, only requests not handled by any route
const unknownEndpointHandler = (request, response) => {
    logger.error(`unknown endpoint: ${request.path}`)
    response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
    requestLogger,
    errorHandler,
    unknownEndpointHandler
}
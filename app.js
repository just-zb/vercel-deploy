const notesRouter = require('./controllers/notes')
const express = require('express');
const mongoose = require("mongoose");
const app = express()
const config = require('./utils/config')
const logger = require('./utils/logger')
const cors = require('cors');
const middlewares = require('./utils/middlewares')

mongoose.set('strictQuery',false)
logger.info(`connecting to ${config.MONGODB_URI}`)
mongoose.connect(config.MONGODB_URI)
    .then(()=>logger.info(`successfully connecting to ${config.MONGODB_URI}`))
    .catch(error=>logger.error('error connecting to database', error))

// use cors
app.use(cors());
// or static directory is public
app.use(express.static('dist'))
// use json parser middleware, at the beginning of handling request
app.use(express.json())
app.use(middlewares.requestLogger)
// use relative path in notesRouter
app.use('/api/notes', notesRouter)
// before the error handler is unsupported endpoint
app.use(middlewares.unknownEndpointHandler)
// errorHandler is the last
app.use(middlewares.errorHandler)



module.exports=app

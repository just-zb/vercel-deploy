// config dotenv before import note.js
require('dotenv').config();
const Note = require('./modules/note')

// const http = require('http');

// const app = http.createServer((req, res) => {
//     res.writeHead(200, {'Content-Type': 'text/json'});
//     res.end(JSON.stringify(notes));
// })

const PORT = process.env.PORT || 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`);

const express = require('express');
const app = express()
const cors = require('cors')
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
const errorHandler = (error, req, res, next) => {
    console.log(error.message)
    if (error.name === 'CastError'){
        // use status() not statusCode()
        return res.status(400).send({error: 'malformed id!'})
    }else if (error.name === 'ValidationError'){
        return res.status(400).json({error: error.message})
    }
    next(error)
}
// use json parser middleware, at the very beginning
app.use(express.json())
// use cors
app.use(cors())
// define a middleware, the order of middlewares is the order of calling `use`

app.use(requestLogger)
// define static pages
app.use(express.static('dist'))


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes=>{
        console.log('the fetch notes is',notes)
        response.json(notes)
    })
})
// :id
app.get('/api/notes/:id', (req, res,next) => {

    // find note in mongodb, as both req id and mongodb id are String
    Note.findById(req.params.id).then(note=>{
        if (note){
            console.log('found note is:',note)
            res.json(note)
        }else res.status(404).end('not found')
    }).catch(error=>next(error))



})

app.post('/api/notes', (req, res,next) => {
    const noteBody = req.body
    if (!noteBody) {
        return res.status(400).json({error: 'request body Not Found'})
    }
    if (!noteBody.content){
        return res.status(400).json({error: 'No Note content found'})
    }
    // how to insert the body Note into notes in POST?
    const note = new Note({
        content: noteBody.content,
        important: noteBody.important || false,
    })
    note.save().then(note=>{
        console.log('Note saved! and return Note:',note)
        res.json(note)
    }).catch(error=>next(error))

})

app.put('/api/notes/:id', (req, res,next) => {
    const note = {
        content: req.body.content,
        important: req.body.important,
    }
    // how to insert the body note into notes in POST?
    // param note is a javascript object, not note model
    Note.findByIdAndUpdate(req.params.id, note,
        // run validation of findByOneAndUpdate
        {new: true, runValidators:true, context:'query'})
        .then(updatedNote =>{
            res.json(updatedNote)
        }).catch(error=>next(error)) // note might not fulfill the standard,eg, minLength=5
})

app.delete('/api/notes/:id', (req, res,next) => {
    Note.findByIdAndDelete(req.params.id,{}).then(result=>{
        res.status(204).end()
    }).catch(error=>next(error))
})

// middleware after route, only requests not handled by any route
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
// before the error handler is unsupported endpoint
app.use(unknownEndpoint)
// errorHandler is the last
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
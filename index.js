let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

const http = require('http');

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

// use json parser middleware
app.use(express.json())

app.use(cors())
// define a middleware
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
    const  id = (Number)(req.params.id)
    console.log(typeof id)
    const note = notes.find(note => note.id === id)
    console.log(note)
    if (note)
    res.json(note)
    else res.status(404).end()
})

app.post('/api/notes', (req, res) => {
    const note = req.body
    if (!note) {
        return res.status(400).json({error: 'Not Found'})
    }
    if (!note.content){
        return res.status(400).json({error: 'No content found'})
    }
    // notes.push(JSON.parse(note))
    console.log(note)
    res.json(note)
})

app.put('/api/notes/:id', (req, res) => {
    const  id = (Number)(req.params.id)
    const note = req.body
    const notesId = notes.find(note => note.id === id)
//     TODO
})

app.delete('/api/notes/:id', (req, res) => {
    const id = (Number)(req.params.id)
    const note = notes.find(note => note.id === id)
    notes = notes.filter(note => note.id !== id)
    res.status(204).end()
})

// middleware after route, only requests not handled by any route
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
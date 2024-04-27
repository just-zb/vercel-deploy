const notesRouter = require('express').Router();
const logger = require('../utils/logger')
const Note = require('../modules/note');

notesRouter.get('/', (request, response) => {
    Note.find({}).then(notes=>{
        logger.info('the fetch notes is',notes)
        response.json(notes)
    })
})

// :id
notesRouter.get('/:id', (req, res,next) => {

    // find note in mongodb, as both req id and mongodb id are String
    Note.findById(req.params.id).then(note=>{
        if (note){
            logger.info('found note is:',note)
            res.json(note)
        }else res.status(404).end('not found')
    }).catch(error=>next(error))
})

notesRouter.post('/', (req, res,next) => {
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
        logger.info('Note saved! and return Note:',note)
        res.json(note)
    }).catch(error=>next(error))

})

notesRouter.put('/:id', (req, res,next) => {
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

notesRouter.delete('/:id', (req, res,next) => {
    Note.findByIdAndDelete(req.params.id,{}).then(result=>{
        res.status(204).end('deleted!')
    }).catch(error=>next(error))
})

module.exports = notesRouter
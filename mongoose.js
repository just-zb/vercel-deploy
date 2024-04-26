const mongoose = require('mongoose');
// import dotenv config
require('dotenv').config();

if (process.argv.length < 3){
    console.log('give a password!')
    process.exit(1)
}
const password = process.argv[process.argv.length - 1]

const url = `mongodb+srv://michael:${password}@cluster0.vq05bmh.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new  mongoose.Schema({
    content: String,
    important: Boolean
})

const Note = mongoose.model('Note',noteSchema)

const note1 = new Note({
    content: 'Michael is handsome',
    important: true
})
const note2 = new Note({
    content: 'Michael is hardworking, and he love programming',
    important: false
})
const note3 = new Note({
    content: 'First hard, then sweet',
    important: false
})
// note1.save().then(result=>{
//     console.log('result saved! result='+JSON.stringify(result))
//     mongoose.connection.close().then(()=>console.log('connection closed!'))
// })
// Note.find({important: false}).then(result=>{
//     result.forEach(note=>{
//         console.log('the note is',note)
//     })
//     mongoose.connection.close().then((connection)=>{
//         console.log('connection closed')})
// })
const notes = []
notes.push(note1)
notes.push(note2)
notes.push(note3)
notes.forEach(note=>{
    note.save().then(()=>{
        console.log('saved!',note)
    })
})
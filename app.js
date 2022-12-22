const express = require('express')
const { connectToDb, getDb } =  require('./db')

// app init & middleware
const app = express()

//db
let db
connectToDb((err) => {
    if(!err){
    //listen
        app.listen(3000, () => {
            console.log('listen localhost:3000')
        })

        db = getDb()
    }
})

//get
app.get('/', (req, res) => {
    // res.json({ msg: "hello mongodb and express"})
    
    let books = []
    db.collection('books')
        .find()
        .sort({ author: 1 })
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({error: "cannot fetch data from documents"})
        })
})
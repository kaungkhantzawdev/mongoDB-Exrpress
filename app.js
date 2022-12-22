const express = require('express')
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } =  require('./db')

// app init & middleware
const app = express()
app.use(express.json())

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
    let page = req.query.p || 0
    let BookPerPage = 3
    
    let books = []
    db.collection('books')
        .find()
        .sort({ author: 1 })
        .skip(page * BookPerPage) //pagination
        .limit(BookPerPage)
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json({ data: books})
        })
        .catch(() => {
            res.status(500).json({error: "cannot fetch data from documents"})
        })
})



//find id
app.get('/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .findOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.json({ data: result })
        })
        .catch(() => {
            res.status(500).json({ error: 'Could not fetch document'})
        })
    }else{
        res.status(500).json({ error: 'invalid id'})
    }
})

//post method to create
app.post('/create', (req, res) => {
    let book = req.body
    db.collection('books')
        .insertOne(book)
        .then(result => {
            res.json({data: result, msg: "successfully inserted"})
        })
        .catch(err => {
            res.status(500).json({ error: 'Could not insert data'})
        })
})


//delete
app.delete('/:id', (req, res) => {
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.json({ data: result, msg: "successfully deleted" })
        })
        .catch(() => {
            res.status(500).json({ error: 'Could not fetch document'})
        })
    }else{
        res.status(500).json({ error: 'invalid id'})
    }
})

//update
app.patch('/:id', (req, res) => {
    let update = req.body
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .updateOne({_id: ObjectId(req.params.id)}, {$set: update })
        .then(result => {
            res.json({ data: result, msg: "successfully updated" })
        })
        .catch(() => {
            res.status(500).json({ error: 'Could not fetch document'})
        })
    }else{
        res.status(500).json({ error: 'invalid id'})
    }
})
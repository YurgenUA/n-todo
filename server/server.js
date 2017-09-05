const {mongoose} = require('./db/mongoose');
const {ObjectId} = require('mongodb');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const express = require('express');
const bodyParser = require('body-parser');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    console.log('----------------');
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then(doc => {
        res.send(doc);
    }, e =>{
        res.status(400).send(e);
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then( todos => {
        res.send({todos})
    }, e => {
        res.status(400).send(e);
    })
});

app.get('/todos/:id', (req, res) => {
    //req.params.id

    //check if id is ObjectId
    if (!ObjectId.isValid(req.params.id)){
        return res.status(400).send({});
    }

    Todo.findById(req.params.id)
    .then(o => {
        if (!o) {
            return res.status(404).send({});
        }
        res.send({todo:o});
    })
    .catch(e => {
        res.status(500).send(e);
    })
})

app.listen(port, () => {
    console.log(`started on port ${port}`);
})

module.exports = {app}
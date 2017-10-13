var env = process.env.NODE_ENV || 'development';

if (env == 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
}
else if (env == 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}

const _ = require('lodash');
const {mongoose} = require('./db/mongoose');
const {ObjectId} = require('mongodb');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const express = require('express');
const bodyParser = require('body-parser');
const {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    let todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then(doc => {
        res.send(doc);
    }, e =>{
        res.status(400).send(e);
    })
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then( todos => {
        res.send({todos})
    }, e => {
        res.status(400).send(e);
    })
});

app.get('/todos/:id', authenticate, (req, res) => {
     //check if id is ObjectId
    if (!ObjectId.isValid(req.params.id)){
        return res.status(400).send({});
    }
    
    Todo.findOne({
        _id: req.params.id,
        _creator: req.user._id
    })
    .then(o => {
        if (!o) {
            return res.status(404).send({});
        }
        res.send({todo:o});
    })
    .catch(e => {
        res.status(500).send(e);
    })
});

app.delete('/todos/:id', authenticate, (req, res) => {
    //check if id is ObjectId
   if (!ObjectId.isValid(req.params.id)){
       return res.status(400).send({});
   }

   Todo.findOneAndRemove({
       _id: req.params.id,
       _creator: req.user._id
   })
   .then(o => {
       if (!o) {
           return res.status(404).send({});
       }
       res.send({todo:o});
   })
   .catch(e => {
       res.status(500).send(e);
   })
});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectId.isValid(id)){
        return res.status(400).send({});
    }
   
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }
    else{
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, 
    {$set: body },
    {new:true}
    ).then(todo => {
        if(!todo){
            return res.status(404).send({});
        }

        return res.send({todo});
    }).catch(e => {res.status(404).send(e)});
});

app.post('/users', (req, res) => {
    var user =  new User(
        _.pick(req.body, ['email', 'password'])
    );

    user.save().then(user => {
        return user.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send(user);
    }).catch(e => {
        res.status(400).send(e);
    });
});


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    
    return User.findByCredentials(email, password)
    .then(user => {
        if(!user){
            return res.status(404).send({});
        }
        return user.generateAuthToken()
        .then(token => {
            res.header('x-auth', token).send(user);
        });
    })
    .catch(err => {
        res.status(400).send(err);
    })
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`started on port ${port}`);
})

module.exports = {app}
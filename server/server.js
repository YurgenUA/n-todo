const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required : true
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

// var todo = new Todo({
//     text: 'Save db'
// });

// todo.save().then(res => {
//     console.log('saved object with mongoose');
// }, e => {
//     console.log('failed saving');
// })

var todo = new Todo({
    text: 'Save db 2',
    completed: true,
    comppletedAt: 555
});

todo.save().then(res => {
    console.log('saved object with mongoose');
}, e => {
    console.log('failed saving', e);
});

var User = mongoose.model('User',  {
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1
    }
});

var user = new User({
    email: '               fenyuk@mail.ru'
});

user.save().then(res => {
    console.log('user saved with mongoose')
}, e => {
    console.log('failed to save user', e);
})
const ObjectId = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '59ac5fd6d9dea326800ca0b1';

if(!ObjectId.IsValid(id)){
    console.log('Id is not valid');
}

// Todo.find({
//     _id:id
// }).then(todos => {
//     console.log('Todos',todos);
// });

// Todo.findOne({
//     _id:id
// }).then(todo => {
//     console.log('Todo',todo);
// });


Todo.findById(id).then(todo => {
    console.log('Todo by id',todo);
});

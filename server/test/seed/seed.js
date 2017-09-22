const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');


const user1Id = new ObjectId();
const user2Id = new ObjectId();
const TestUsers = [
    {
        _id: user1Id,
        email: 'one@example.com',
        pass: '1pass',
        tokens: [
            {
                access:'auth',
                token: jwt.sign({_id: user1Id, access: 'auth'}, 'abc123').toString()
            }
        ]
    },
    {
        _id: user2Id,
        email: 'two@example.com',
        pass: '2pass',

    }
]

const TestTodos = [
    {
        _id: new ObjectId(),
        text: '1st test'
    },
    {
        text: '2nd test',
        _id: new ObjectId(),
        completed: true,
        completedAt: 333
    }
]


const Populate = done => {
    Todo.remove({})
    .then(() => Todo.insertMany(TestTodos))
    .then(() => {return User.remove({})})
    .then(() =>{
        let user1 = new User(TestUsers[0]).save();
        let user2 = new User(TestUsers[1]).save();
        return Promise.all([user1, user2]);
    } )
    .then(() => done());
};

module.exports = {
    TestTodos,
    TestUsers,
    Populate
}
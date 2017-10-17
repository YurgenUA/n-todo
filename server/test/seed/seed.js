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
        password: '1pass',
        tokens: [
            {
                access:'auth',
                token: jwt.sign({_id: user1Id, access: 'auth'}, process.env.JWT_SECRET).toString()
            }
        ]
    },
    {
        _id: user2Id,
        email: 'two@example.com',
        password: '2pass',
        tokens: [
            {
                access:'auth',
                token: jwt.sign({_id: user2Id, access: 'auth'}, process.env.JWT_SECRET).toString()
            }
        ]

    }
]

const TestTodos = [
    {
        _id: new ObjectId(),
        text: '1st test',
        _creator: user1Id
    },
    {
        text: '2nd test',
        _id: new ObjectId(),
        completed: true,
        completedAt: 333,
        _creator : user2Id

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
const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const TestTodos = [
    {text: '1st test'},
    {text: '2nd test'}
]

beforeEach(done => {
    Todo.remove({})
    .then(() => Todo.insertMany(TestTodos))
    .then(() => done());
})


describe('GET /todos', () => {
    it('should create a new todo', (done)=> {
        request(app)
        .get('/todos')
        .expect(200)
        .expect( res => {
            expect(res.body.todos.length).toBe(2);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }
                done();
        });

    });
});

describe('POST /todos', () => {

    it('should create a new todo', (done)=> {
        var text = "todo test";

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect( res => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.find({text}).then(todos =>{
                expect(todos.length).toBe(1);
    
                done();
            }).catch(e => done(e));
        });
    });

    it('should not create todo with invalid data', (done)=> {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.find().then(todos =>{
                expect(todos.length).toBe(2);
    
                done();
            }).catch(e => done(e));
        });
    });
    
});

const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {ObjectId} = require('mongodb');

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

describe('GET /todos/:id', () => {
    it('should return valid todo', done => {
        request(app)
        .get(`/todos/${TestTodos[0]._id}`)
        .expect(200)
        .expect(res => {
            expect(res._id).toBe(TestTodos[0]._id);
        })
        .end(() => {
            done();
        })
    });

    it('should return 404 not found', done => {
        request(app)
        .get(`/todos/${new ObjectId()}`)
        .expect(404)
        .end(done);
    });
    
    it('should return 400 if not object sent', done => {
        request(app)
        .get(`/todos/444`)
        .expect(400)
        .end((err, res) => {
            done(err);
        })
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

describe('PATCH /todos/:id', () => {
    it('should update todo', done => {
        request(app)
        .patch(`/todos/${TestTodos[0]._id}`)
        .send({text: 'updated text', completed: true})
        .expect(200)
        .expect(res => {
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.text).toBe('updated text');
    
        }) 
        .end(done);
    });

    it('should clear completedAt when todo is not completed', done => {
        request(app)
        .patch(`/todos/${TestTodos[1]._id}`)
        .send({text: 'updated text', completed: false})
        .expect(200)
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.text).toBe('updated text');
            expect(res.body.todo.completedAt).toNotExist();
            
            return done();
        });
    });
    
});
    

describe('DELETE /todos/:id', () => {
    it('should delete todo', done => {
        request(app)
        .delete(`/todos/${TestTodos[1]._id}`)
        .expect(200)
        .expect(res => {
            expect(res._id).toBe(TestTodos[1]._id);
        })
        .end(() => {
            Todo.findById(TestTodos[1]._id).then(todo =>{
                expect(todo).toNotExist();
                done();
            }).catch(err => done(err));    

        })
    });

    it('should return 404 not found', done => {
        request(app)
        .delete(`/todos/${new ObjectId()}`)
        .expect(404)
        .end(done);
    });
    
    it('should return 400 if id is invalid', done => {
        request(app)
        .delete(`/todos/444`)
        .expect(400)
        .end((err, res) => {
            done(err);
        })
    });    
});

const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectId} = require('mongodb');
const {TestTodos, TestUsers, Populate} = require('./seed/seed')



beforeEach(Populate);


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
            expect(res.body._id.ToString()).toBe(TestTodos[0]._id.ToString());
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
        .end(done)
    });    
});


describe('GET /users/me', () => {

    it('should return user if authenticated', done => {
        request(app)
        .get('/users/me')
        .set('x-auth', TestUsers[0].tokens[0].token)
        .expect(200)
        .expect(res => {
            expect(res.body._id).toBe(TestUsers[0]._id.toHexString());
            expect(res.body.email).toBe(TestUsers[0].email);
        })
        .end(done)
    });

    it('should return 401 if not authenticated', done =>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect(res => {
            expect(res.body).toEqual({});
        })
        .end(done)
    });

});

describe('POST /users', () => {

    it('should create user', done => {
        let email = 'example@example.com';
        let password = '123frtg!!';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect(res => {
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);

        })
        .end(done)

    });

    it('should return validation errors if request invalid', done => {
        request(app)
        .post('/users')
        .send({email: 'email', password: '123'})
        .expect(400)

        .end(done);

    });

    it('should not create if email in use', done => {
        request(app)
        .post('/users')
        .send({email: 'one@example.com', password: '123'})
        .expect(400)

        .end(done);
    });


});

describe('POST /users/login', () => {
    it ('should login user and return token', done => {
        request(app)
        .post('/users/login')
        .send({
            email: TestUsers[1].email,
            password: TestUsers[1].password
        })
        .expect(200)
        .expect(res => {
            expect(res.headers['x-auth']).toExist();
        })
        .end((err, res) => {
            if (err){
                return done(err);
            }
            User.findById(TestUsers[1]._id)
            .then(user => {
                if (!user){
                    return done('no user found in collecion');
                }

                expect(user.tokens[0]).toInclude({
                    access: 'auth',
                    token: res.headers['x-auth']
                })
            })

            done();
        });
    });

    it ('should reject invalid login', done => {
        request(app)
        .post('/users/login')
        .send({
            email: TestUsers[1].email,
            password: 'invalid'
        })
        .expect(400)
        .expect(res => {
            expect(res.headers['x-auth']).toNotExist();
        })
        .end((err, res) => {
            if (err){
                return done(err);
            }
            User.findById(TestUsers[1]._id)
            .then(user => {
                if (!user){
                    return done('no user found in collecion');
                }

                expect(user.tokens.length).toBe(0);
            })

            done();
        });
    });    
})
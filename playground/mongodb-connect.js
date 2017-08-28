const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err){
        return console.log('Unable to connect');
    }
    console.log('Connected to MongoDB');

    db.collection('Todos').insertOne({
        text:'Something to do',
        completed: false
    }, (err, res) => {
        if (err){
            return console.log('Failed to insert doc');
        }
        console.dir(res.ops);
    })

    db.collection('Users').insertOne({
        name:'Yuri',
        age: 19,
        location: 'UA'
    }, (err, res) => {
        if (err){
            return console.log('Failed to insert doc');
        }
        console.dir(res.ops);
    })


    db.close();
});


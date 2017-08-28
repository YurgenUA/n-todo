const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err){
        return console.log('Unable to connect');
    }
    console.log('Connected to MongoDB');

    //delete many
 //   db.collection('Todos').deleteMany({text: 'Eat lunch 3'})
 //   .then(res => {
 //       console.dir(res);
 //   })

    //delete one
    // db.collection('Todos').deleteOne({text: 'Eat lunch 2'})
    // .then(res => {
    //     console.dir(res);
    // });

    //findOne and delete
    db.collection('Todos').findOneAndDelete({completed: false})
    .then(res => {
        console.dir(res);
    });

//    db.close();
});


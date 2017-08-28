const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err){
        return console.log('Unable to connect');
    }
    console.log('Connected to MongoDB');

//     db.collection('Todos').find({_id:new ObjectID('59a3332d6da93d27f48acf87')}).toArray()
//    .then(col => {
//         console.log('here');
//         console.dir(col)
//    }, err => {
//        console.log('Unable to find coll', err);
//    })

// db.collection('Todos').count()
// .then(c => {
//     console.log(`Total count: ${c}`);
// })

db.collection('Users').find({name:'Yuri'}).toArray()
.then(col => {
    console.dir(col);
})

    //db.close();
});


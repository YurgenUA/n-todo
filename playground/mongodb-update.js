const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect');
    }
    console.log('Connected to MongoDB');

    // //findOne and update
    // db.collection('Todos').findOneAndUpdate(
    //     { _id: new ObjectId("59a42a269107fc8f074c6fd8") },
    //     {
    //         $set: {
    //             "text": "Eat lunch again"
    //         }
    //     },
    //     {
    //         returnOriginal: false
    //     }
    // )
    //     .then(res => {
    //         console.dir(res);
    //     });


    //findOne and update
    db.collection('Users').findOneAndUpdate(
        { _id: new ObjectId("59a437779107fc8f074c71e8") },
        {
            $set: {
                "name": "Mega man"
            },
            $inc: {
                age:1
            }
        },
        {
            returnOriginal: false
        }
    )
        .then(res => {
            console.dir(res);
        });
        
    //    db.close();
});


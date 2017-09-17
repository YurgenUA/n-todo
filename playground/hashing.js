const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


var data = {
    id:10
};


var token = jwt.sign(data, '123');
console.log(`jwt token ${token}`);

// var message = 'user';
// var hash = SHA256(message).toString();

// console.log(hash);


// let data = {
//     id: 5
// }

// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'secret').toString()
// };


// let resultHash = SHA256(JSON.stringify(token.data) + 'secret').toString();

// if(token.hash === resultHash){
//     console.log("good data");
// }
// else {
//     console.log('corrupted data');
// }
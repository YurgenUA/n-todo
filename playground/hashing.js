const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (err, salt) =>{
//     console.log('salt ', salt);
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log('hash ', hash);
        
//     });
// });

var hashedPassword = '$2a$10$EL81cU/kEublioMVRS5sjuhZbkXowYKRG3G/jxlknitaDl9HFnnfa';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log('res ', res);
});

// var data = {
//     id:10
// };


// var token = jwt.sign(data, '123');
// console.log(`jwt token ${token}`);

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
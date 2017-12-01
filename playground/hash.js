const {SHA256} = require('crypto-js');
const  jwt = require('jsonwebtoken');

var data = {
  id :24
};

var token = jwt.sign(data , 'asddgggfe');
console.log(token);

var decoded = jwt.verify(token, 'asddgggfe' );
console.log(decoded);
// var msg = 'My name is Jeet Adhikary';
// var hash = SHA256(msg).toString();
//
// console.log(hash);

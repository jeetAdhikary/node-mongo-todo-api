const {SHA256} = require('crypto-js');
const  jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


var password = 'sagarbanchod';

// bcrypt.genSalt(10 , (err, salt)=>{
//   bcrypt.hash(password, salt ,(err, hash) =>{
//     console.log(hash);
//   });
// })

var hashedpw = '$2a$10$lZ6MatV0Kas8BY1kTHuUGuiOeuiGBgLpBuXRqCBUQMeCJ7lH9Oabq';

bcrypt.compare(password, hashedpw, (err, result)=>{
  console.log(result);
})


// var data = {
//   id :24
// };

// var token = jwt.sign(data , 'asddgggfe');
// console.log(token);

// var decoded = jwt.verify(token, 'asddgggfe' );
// console.log(decoded);
// var msg = 'My name is Jeet Adhikary';
// var hash = SHA256(msg).toString();
//
// console.log(hash);

const {ObjectID} = require('mongodb');
const jwt =require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');


const todos = [{
    _id : new ObjectID(),
    text : 'First Test Case'
  },
  {
    _id : new ObjectID(),
    text : 'Second Test case',
    completed : true,
    completedAt : 4252634
  }];

const userOneObjId = new ObjectID();
const userTwoObjId = new ObjectID();
const access = 'auth';

const users = [{
  _id : userOneObjId,
  email : 'sagargandu@gmail.com',
  password : 'sagarboachoda',
  tokens : [{
      access,
      token : jwt.sign({_id: userOneObjId.toHexString(), access}, 'jeetAdikary').toString()
  }]  
},{
    _id : userTwoObjId,
    email : 'sudipgandu@gmail.com',
    password : 'sudipbokachoda'
}];

const populateTodos = (done)=>{
    Todo.remove({}).then(()=>{
       return Todo.insertMany(todos)
    }).then(()=> done());
  };

const populateUsers = (done)=>{
    User.remove({}).then(()=>{
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(()=> done()).catch((e)=>{
        console.log(e);
    })
}
module.exports = {todos , populateTodos , users , populateUsers}
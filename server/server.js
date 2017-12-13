require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app =express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
  var newTodo =Todo({
    text : req.body.text
  });
  newTodo.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send(e)
  })
});

app.get('/todos',(req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  },(e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }
  Todo.findById(id).then((todo) => {
    if (!todo) {
      res.status(404).send();
    }
    res.send({todo});res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  });
});

app.delete('/todos/:id',(req,res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
     return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
     res.status(404).send();
    }
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  });
});

app.patch('/todos/:id',(req,res)=>{
  var id = req.params.id;
  var body = _.pick(req.body ,['text', 'completed']);
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
  }
  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate( id , {$set : body},{new : true}).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  })
});

app.post('/user', (req, res)=>{
  var body = _.pick(req.body,['email', 'password']);
  var newUser = User(body);
  newUser.save().then(()=>{
   return newUser.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth', token).send(newUser);
  }).catch((e)=>{
    res.status(400).send(e);
  });
});


app.get('/user/me', authenticate, (req, res)=>{
  var token = req.header('x-auth');
  res.send(req.user);
});


// app.post('/user/login', (req, res)=>{
//  var body = _.pick(req.body,['email','password']);
//   User.findOne({email : body.email}).then((user)=>{
//     bcrypt.compare(body.password, user.password,(err,result)=>{
//       if(err){
//         res.status(400).send();
//       }
//       if(!result){
//         res.status(401).send();
//       }
//       res.send(user);
//     });
//   }).catch((e)=>{
//     res.status(400).send();
//   })
// });

app.post('/user/login', (req, res)=>{
  var body = _.pick(req.body,['email','password']);

  User.findByCredentials(body.email, body.password).then((user)=>{
    return user.generateAuthToken().then((token)=>{
      res.header('x-auth',token).send(user);
    });
  }).catch((e)=>{
    if(e){
      console.log(e);
    }
    res.status(400).send();
  });
});
app.listen(port,()=>{
  console.log('Server Started on Port 3000');
});

module.exports= {app};

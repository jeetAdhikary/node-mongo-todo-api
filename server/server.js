require('./config/config');

var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const {ObjectID} = require('mongodb');
var {authenticate} = require('./middleware/authenticate');
var app =express();
const port = process.env.PORT ;

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
    res.send({todo});
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
    console.log(e);
    res.status(400).send(e);
  });
});


app.get('/user/me', authenticate, (req, res)=>{
  var token = req.header('x-auth');
  res.send(req.user);
});

app.listen(port,()=>{
  console.log('Server Started on Port 3000');
});

module.exports= {app};

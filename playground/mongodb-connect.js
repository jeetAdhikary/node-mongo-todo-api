const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=>{
  if(err){
    return console.log('Unable to connect mongodb Server');
  }
  console.log('connected to mongodb Server');
  // db.collection('Todos').insertOne({
  //   text : 'Something to do',
  //   completed: false
  // }, (err, result)=>{
  //   if(err){
  //     return console.log('unable to insert',err);
  //   }
  //   console.log(result);
  // });
  db.collection('User').insertOne({
    name : 'Jeet Adhikary',
    age : 25,
    location : 'Chennai'
  },(err,result)=>{
    if(err){
      return console.log('Unable to insert User', );
    }
    console.log(result.ops);
  })
  db.close();
});

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=>{
  if(err){
    return console.log('Unable to connect mongodb Server');
  }
  console.log('connected to mongodb Server');

  db.collection('Todos').find().count().then((count)=>{
      console.log(`Total Count : ${count}`);
  },(err)=>{
    console.log('unable to fetch data form Todos', err);
  });
  db.close();
});

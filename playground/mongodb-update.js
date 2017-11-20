const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=>{
  if(err){
    return console.log('Unable to connect mongodb Server');
  }
  console.log('connected to mongodb Server');

  db.collection('User').findOneAndUpdate({name: 'Debattam Upadhyaya'},
    {
      $set : {
        name: 'Jeet Adhikary'
      },
      $inc : {age : 1}
    },{
      returnOriginal : false
    }).then((result)=>{
      console.log(result);
    })
  db.close();
});

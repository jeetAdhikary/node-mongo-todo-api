const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id : new ObjectID(),
  text : 'First Test Case'
},
{
  _id : new ObjectID(),
  text : 'Second Test case',
  completed : true,
  completedAt : 4252634
}]

beforeEach((done)=>{
  Todo.remove({}).then(()=>{
     return Todo.insertMany(todos)
  }).then(()=> done());
});

describe('POST / todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app).post('/todos').send({text}).expect(200).expect((res) => {
      expect(res.body.text).toBe(text);
    }).end((err, res) => {
      if (err) {
        return done(err);
      }

      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    });
  });

  it('Should not create todo with invalid body data', (done)=>{
    request(app).post('/todos').send({}).expect(400).end((err, res)=>{
      if(err){
        return done(err);
      }

      Todo.find().then((todos)=>{
        expect(todos.length).toBe(2);
        done();
      }).catch((e)=> done(e));
    });
  });
});

describe('GET / todos', ()=>{
  it('should get all todos', (done)=>{
    request(app).get('/todos').expect(200).expect((res)=>{
      expect(res.body.todos.length).toBe(2);
    }).end(done);
  });
});


describe('GET /todo by ID ', ()=>{
  it('Shoduld return todo doc', (done)=>{
    request(app).get(`/todos/${todos[0]._id.toHexString()}`).expect(200).expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text);
    }).end(done);
  });

  it('Should retun 404 if todo is not found', (done)=>{
    var newObj = new ObjectID();
    request(app).get(`/todos/${newObj.toHexString()}`).expect(404).expect((res)=>{
      expect(res.body.todo).toBe(undefined);
    }).end(done);
  });

  it('Should retun 404 of objectId is not valid', (done)=>{
    var newObj = 123;
    request(app).get(`/todos/${newObj}`).expect(404).expect((res)=>{
      expect(res.body.todo).toBe(undefined);
    }).end(done);
  });
});


describe('DELETE / Todos by ID ', () => {
  it('Should delete the todo doc', (done) => {
    var hexId = todos[0]._id.toHexString();
    request(app).delete(`/todos/${hexId}`).expect(200).expect((res) => {
      expect(res.body.todo._id).toBe(hexId);
    }).end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.findById(hexId).then((todos) => {
        expect(todos).toNotExist;
        done();
      }).catch((e) => done(e));
    });
  });

  it('Should return 404 if objectid is invalid', (done) => {
    request(app).delete('/todos/123').expect(404).end(done);
  });

  it('Should return 404 if object id is not found', (done) => {
    var newObj = new ObjectID();
    request(app).delete(`/todos/${newObj.toHexString()}`).expect(404).end(done);
  });
});

describe('PATCH /todos by ID',()=>{
  it('should update the todo',(done)=>{
    var testBody = {
      text : 'updating thu test script',
      completed : true
    }

    var hexId = todos[0]._id.toHexString();
    request(app).patch(`/todos/${hexId}`).send(testBody).expect(200).expect((res)=>{
      expect(res.body.todo.text).toBe(testBody.text);
      expect(res.body.todo.completed).toBe(testBody.completed);
      expect(res.body.todo.completedAt).toExist;
    }).end((err,res)=>{
      if(err){
        return done(err);
      }
      Todo.findById(hexId).then((todos)=>{
        expect(todos.text).toBe(testBody.text);
        expect(todos.completed).toBe(testBody.completed);
        expect( typeof todos.completedAt).toBe('number');
        done();
      }).catch((e) => done(e));
    });
  });

  it('should clear the component when todo is not completed', (done)=>{
    var testBody = {
      completed : false
    }
    var hexId = todos[1]._id.toHexString();
    request(app).patch(`/todos/${hexId}`).send(testBody).expect(200).expect((res)=>{
      expect(res.body.todo.completed).toBe(testBody.completed);
      expect(res.body.todo.completedAt).toNotExist;
    }).end((err, res)=>{
      if(err){
        return done(err);
      }
      Todo.findById(hexId).then((todos)=>{
        expect(todos.completed).toBe(testBody.completed);
        expect(todos.completedAt).toNotExist;
        done();
      }).catch((e) => done(e));
    });
  });
});

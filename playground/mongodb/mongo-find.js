import { MongoClient, ObjectID } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'TodoApp';

module.exports = (function () {
  MongoClient.connect(url, (err, client) => {
    if (err) {
      return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected successfully to server...');

    const db = client.db(dbName);

    const collection = db.collection('Todos');

    // collection.find({
    //   completed: false
    // })
    // .toArray()
    // .then(docs => {
    //   console.log('Todos');
    //   console.log(JSON.stringify(docs, undefined, 2));
    //   client.close();
    // })
    // .catch(err => {
    //   console.log('Error:', err);
    // });

    collection.find({
      completed: false
    })
    .count()
    .then(count => {
      console.log('Todos count:', count);
      client.close();
    })
    .catch(err => {
      console.log('Error:', err);
    });

  });
})();

import { MongoClient, ObjectID } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'TodoApp';

module.exports = (function() {
  MongoClient.connect(url, (err, client) => {
    if (err) {
      return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected successfully to server...');

    const db = client.db(dbName);

    const collection = db.collection('Todos');

    collection.insertOne({
      text: 'Something to do',
      completed: false
    }, (err, result) => {
      if (err) {
        return console.log('Unable to insert todo', err);
      }

      console.log(JSON.stringify(result.ops, undefined, 2));
      console.log(result.ops[0]._id.getTimestamp());
    });

    client.close();
  });
})();

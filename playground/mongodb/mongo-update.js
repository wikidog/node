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

    collection.findOneAndUpdate({
      _id: new ObjectID('5a7c7da18102183ab4c9c710')
    }, {
      $set: {
        completed: true
      }
    }, {
      returnOriginal: false
    })
    .then(result => {
      console.log('Result:', result);
      client.close();
    })
    .catch(err => {
      console.log('Error:', err);
    });

  });
})();

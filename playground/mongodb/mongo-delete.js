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

    // collection.deleteMany({
    //   text: 'AAAAA AA'
    // })
    // .then(result => {
    //   console.log('Todos count:', result);
    //   client.close();
    // })
    // .catch(err => {
    //   console.log('Error:', err);
    // });

    // collection.deleteOne({
    //   text: 'Walk the dog'
    // })
    // .then(result => {
    //   console.log('Todos count:', result);
    //   client.close();
    // })
    // .catch(err => {
    //   console.log('Error:', err);
    // });

    collection.findOneAndDelete({
      completed: true
    })
    .then(result => {
      console.log('Todos count:', result);
      client.close();
    })
    .catch(err => {
      console.log('Error:', err);
    });

  });
})();

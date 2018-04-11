import mongoose from 'mongoose';

const url = 'mongodb://localhost:27017';
const dbName = 'TodoApp';

// tell mongoose which promise libariry to use
mongoose.Promise = global.Promise;
mongoose.connect(url + '/' + dbName);  // this is async?????

module.exports = { mongoose };

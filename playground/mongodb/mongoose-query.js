import { ObjectID } from 'mongodb';

import { mongoose } from '../../server/db/mongoose';
import { Todo } from '../../server/models/todo';
import { User } from '../../server/models/user';

Todo.find().then(docs => {
  console.log({docs});
}).catch(e => {
  console.log('Error: '. e);
});

import { ObjectID } from 'mongodb';

import { mongoose } from '../../server/db/mongoose';
import { Todo } from '../../server/models/todo';
import { User } from '../../server/models/user';

let id = '5a7d116f655fe8260465461b';

Todo.findByIdAndRemove(id).then(doc => {
  console.log({doc});
}).catch(e => {
  console.log('Error: '. e);
});

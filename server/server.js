import env from './config/config';

import express from 'express';
import bodyParser, { urlencoded } from 'body-parser';
import hbs from 'hbs';
import { ObjectID } from 'mongodb';
import _ from 'lodash';

import { mongoose } from './db/mongoose';
import { Todo } from './models/todo';
import { User } from './models/user';
import { authenticate } from './middleware/authenticate';

const port = process.env.PORT;
const hostname = process.env.HOST;

let app = express();

let urlencodedParser = bodyParser.urlencoded({ extended: false });

hbs.registerPartials(__dirname + '/../views/partials');
app.set('view engine', 'hbs');

app.use('/assets', express.static(__dirname + '/../public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

app.use((req, res, next) => {
  let now = new Date().toUTCString();
  console.log(`(${now}) ${req.method}  ${req.url}`);
  next();
})

app.use(bodyParser.json());

// ====================================================================

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text,
  });

  todo.save()
  .then(doc => {
    res.send(doc);
  })
  .catch(err => {
    res.status(400).send(err);
    console.log(err);
  });
});

app.get('/todos', (req, res) => {
  Todo.find()
  .then(todos => {
    res.send({todos});
  })
  .catch(err => {
    res.status(400).send(err);
    console.log(err);
  });
});

app.get('/todos/:id', (req, res) => {

  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id)
  .then(todo => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  })
  .catch(err => {
    res.status(400).send();
    console.log(err);
  });
});

app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id)
  .then(doc => {
    console.log({doc});
    if (!doc) {
      res.status(404).send();
    }
    res.send({doc});
  })
  .catch(e => {
    console.log('Error: '.e);
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;

  // this pick method is more convenient than JavaScript desctructing
  // in this situation
  let body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (body.completed && _.isBoolean(body.completed)) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
  .then(doc => {
    if (!doc) {
      return res.status(404).send();
    }
    res.send({doc});
  })
  .catch(e => {
    console.log('Error: ', e);
    res.status(400).send();
  });
});

// ------------------------------------------------------------

app.post('/users', (req, res) => {

  let body = _.pick(req.body, ['email', 'password']);

  let user = new User(body);

  user.generateAuthToken()
  .then((token) => {
    res.header('x-auth', token).send(user);
  })
  .catch(err => {
    console.log(err);
    res.status(400).send(err);
  });
});

// use middleware
// private route
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

//
app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
  .then(user => {
    user.generateAuthToken()
    .then((token) => {
      res.header('x-auth', token).send(user);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
  })
  .catch(err => {
    console.log(err);
    res.status(400).send(err);
  });
});

//
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token)
  .then(() => {
    res.send();
  })
  .catch(err => {
    console.log(err);
    res.status(400).send(err);
  });
});

// --------------------------------------------------------------------

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/person/:id', (req, res) => {
  res.render('person', {
    ID: req.params.id,
    Qstr: req.query.qstr
 });
});

app.post('/person', urlencodedParser, (req, res) => {
  res.send('Thank you!');
  console.log(req.body.firstname + ' ' + req.body.lastname);
});

// ====================================================================

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


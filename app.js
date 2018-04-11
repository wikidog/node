import express from 'express';
import bodyParser, { urlencoded } from 'body-parser';
import hbs from 'hbs';

const port = process.env.PORT || 3000;
const hostname = process.env.HOST || '127.0.0.1';

let app = express();

let urlencodedParser = bodyParser.urlencoded({ extended: false });

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use('/assets', express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

app.use((req, res, next) => {
  let now = new Date().toUTCString();
  console.log(`(${now}) ${req.method}  ${req.url}`);
  next();
})

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

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

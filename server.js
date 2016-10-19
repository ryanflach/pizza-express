const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const generateId = require('./lib/generate-id');

app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');

app.locals.title = 'Pizza Express';
app.locals.pizzas = {};

app.get('/', (request, response) => {
  response.render('index');
});

app.get('/pizzas/:id', (request, response) => {
  var requestedPizza = app.locals.pizzas[request.params.id];

  if (requestedPizza) {
    response.render('pizza', { pizza: requestedPizza });
    response.sendStatus(200);
  } else {
    response.sendStatus(404);
  }
});

app.post('/pizzas', (request, response) => {
  var id = generateId();

  app.locals.pizzas[id] = request.body;

  response.sendStatus(201);
});

// Only listen if the server is being accessed directly (i.e., not via the test suite)
if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}

module.exports = app;

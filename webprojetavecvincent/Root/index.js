const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./Routes/routes');
const { PrismaClient } = require('@prisma/client');
const {engine} = require('express-handlebars');
const handlebars = require('express-handlebars');

const app = express();
const port = 3010;
const prisma = new PrismaClient();

const session = require('express-session');

app.engine('handlebars',engine())
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'))

app.use('/public', express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'jh,ngujrtgrf-jn', // Clé secrète pour signer la session, remplacez-la par votre propre clé
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('static'));

app.use(routes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});



const express = require('express');
require('dotenv').config();
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 5001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

const routes = require('./server/routes/vartotojas');
app.use('/', routes);
app.get('/', (req, res) => {
    res.render('home.handlebars');
});


app.listen(PORT, () => console.log(`Serveris vaziuoja ant ${PORT} porto`));
const express = require('express');
require('dotenv').config();
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

const PORT = process.env.PORT || 5001;



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: 'http://localhost:5001',
    credentials: true
}));
app.use(cookieParser());


app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');


const routes = require('./server/routes/vartotojas');
app.use('/', routes);


app.listen(PORT, () => console.log(`Serveris vaziuoja ant ${PORT} porto`));
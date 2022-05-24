const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD
});

exports.perziuretiVartotojus = (req, res) => {
    let query = 'SELECT * FROM user';

    pool.query(query, (err, rows) => {
        console.log(rows)
        if(!err){
            res.render('users', { rows });
        } else {
            console.log(err);
        }
    });
};

exports.perziuretiVisusPostus = (req, res) => {
    let query = 'SELECT * FROM blog';

    pool.query(query, (err, rows) => {
        if(!err){
            console.log(rows)
            res.render('home', { rows });
        } else {
            console.log(err);
        }
        
    });
};

exports.forma = (req, res) => {
    res.render('register');
};

exports.prisijungimoForma = (req, res) => {
    res.render('login');
};

exports.dashboard = (req, res) => {
    res.render('dashboard');
};

exports.postoForma = (req, res) => {
    res.render('createnew');
};

exports.posted = async (req, res) => {
    const token = await req.cookies.AccessToken;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const ID = decoded.user.id;
    const { title, content } = req.body;
    const creationDate = new Date();
    pool.query('INSERT INTO blog SET author_id = ?, title = ?, content = ?, created_at = ?', [ID, title, content, creationDate], (err, result) => {
        if(err) throw err;
    });
};

exports.perziuretiNauja = (req, res) => {
    res.render('home');
};
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

exports.dashboard = (req, res) => {
    res.render('dashboard');
};

exports.postoForma = (req, res) => {
    res.render('createnew');
};


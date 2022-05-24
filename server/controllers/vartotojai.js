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
    const rikiavimas = req.body.rikiuotiPagalAbecele;
    if(rikiavimas){
        query += ' ORDER BY name';
        if(rikiavimas === 'a-z'){
            query += ' ASC';
        } else {
            query += ' DESC';
        }
    }
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
    let query = 'SELECT * FROM user JOIN blog ON user.id = blog.author_id';
    const rikiavimas = req.body.rikiuotiPagalAbecele;
    if(rikiavimas){
        query += ' ORDER BY name';
        if(rikiavimas === 'a-z'){
            query += ' ASC';
        } else {
            query += ' DESC';
        }
    }
    pool.query(query, (err, result) => {
        if(!err){
            res.render('home', { result });
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

    let token, decoded;

    try {
    token = await req.cookies.AccessToken;
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch(err) {
        res.render('createnew', {alert: 'You must be logged in to post'});
        return;
    }
    const ID = decoded.user.id;
    const { title, content } = req.body;
    const creationDate = new Date();
    pool.query('INSERT INTO blog SET author_id = ?, title = ?, content = ?, created_at = ?', [ID, title, content, creationDate], (err, result) => {
        if(err) throw err;
    });
};


exports.perziuretiPosta = async (req, res) => {
    const ID = req.params.id;
    console.log(req.params)
    pool.query('SELECT * FROM blog JOIN user ON user.id = blog.author_id AND blog.id = ?', [ID], (err, result) => {
        if(err) throw err;
        if(result.length > 0) res.render('blogpost', { post: result[0] });
        else res.sendStatus(404);
    });
};
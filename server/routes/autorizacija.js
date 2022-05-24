const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD
});

exports.sukurtiVartotoja = async (req, res) => {
    const { name, email } = req.body;
    const date = new Date();
    const password = req.body.password;
    console.log(password)
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    pool.query('SELECT email FROM user WHERE email = ?', [email], (err, results) => {
        if(err) throw err;
        if(results.length > 0) return res.render('register', {alert: 'El. pasto adresas jau panaudotas'});
    });

    pool.query('INSERT INTO user SET name = ?, email = ?, password = ?, register_time = ?', [name, email, hashedPass, date], (err, rows) => {
        if(!err) {
            res.redirect('dashboard');
        } else {
            console.log(err);
        }
    });
};

exports.prisijungti = async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    pool.query('SELECT')
}
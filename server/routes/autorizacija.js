const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());


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
    const repeatPassword = req.body.repeatPassword;
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    if (password === repeatPassword) {

        pool.query('SELECT email FROM user WHERE email = ? OR name = ?', [email, name], (err, results) => {
            if (err) throw err;
            if (results.length > 0) return res.render('register', { alert: 'Email/Name already in use' });

            pool.query('INSERT INTO user SET name = ?, email = ?, password = ?, register_time = ?', [name, email, hashedPass, date], (err, result) => {
                if (!err) {
                    const token = jwt.sign({ user: { id: result.insertId, name, email } }, process.env.ACCESS_TOKEN_SECRET);
                    res.status(200).cookie('AccessToken', token, {
                        maxAge: 3600000,
                        httpOnly: true,
                    });
                    res.redirect('user');
                } else {
                    console.log(err);
                }
            });
        });

    } else {
        res.render('register', { alert: 'Passwords do not match' });
    }
};

exports.prisijungti = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    pool.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            if (err) throw err;

            const hashedPass = user.password;
            const arTeisingasSlaptazodis = await bcrypt.compare(password, hashedPass);
            if (!arTeisingasSlaptazodis) return res.status(400).render('login', { alert: 'Incorrect password' });

            const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).cookie('AccessToken', token, {
                maxAge: 3600000,
                httpOnly: true,
            });
            res.redirect(301, 'user');

        } else {
            res.render('login', { alert: 'User with that email does not exist' });
        }
    });
};

exports.rodytiVienaVartotoja = async (req, res) => {

    const token = await req.cookies.AccessToken;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const ID = decoded.user.id;
    const name = decoded.user.name;

    pool.query('SELECT * FROM user WHERE id = ?', [ID], (err, result) => {
        if (err) throw err;
        // res.render('dashboard', { result });

        pool.query('SELECT * FROM user JOIN blog ON user.id = blog.author_id AND user.id = ?', [ID], (err, posts) => {
            console.log(posts)
            if (err) throw err;
            res.render('dashboard', { posts, result, name });
        });
    });
};


exports.atsijungti = (req, res) => {
    res.status(200).cookie('AccessToken', null, {
        maxAge: 1,
        httpOnly: true,
    });
    res.redirect('api/blog');
};
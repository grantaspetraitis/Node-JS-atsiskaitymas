const express = require('express');
const router = express.Router();
const vartotojai = require('../controllers/vartotojai');
const autorizacija = require('./autorizacija');
const app = express();
const cookieParser = require('cookie-parser');

app.use(cookieParser());


router.get('/api/users', vartotojai.perziuretiVartotojus);
router.post('/api/users', vartotojai.perziuretiVartotojus);
router.get('/api/blog', vartotojai.perziuretiVisusPostus);
router.post('/api/blog', vartotojai.perziuretiVisusPostus);
router.get('/', vartotojai.perziuretiVisusPostus);
router.get('/register', vartotojai.forma);
router.post('/register', autorizacija.sukurtiVartotoja);
router.get('/user', autorizacija.rodytiVienaVartotoja);
router.get('/createnew', vartotojai.postoForma);
router.post('/createnew', vartotojai.posted);
router.get('/login', vartotojai.prisijungimoForma);
router.post('/login', autorizacija.prisijungti);
router.get('/logout', autorizacija.atsijungti);
router.get('/api/blog/:id', vartotojai.perziuretiPosta);

module.exports = router;
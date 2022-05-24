const express = require('express');
const router = express.Router();
const vartotojai = require('../controllers/vartotojai');
const autorizacija = require('./autorizacija');

router.get('/api/users', vartotojai.perziuretiVartotojus);
router.post('/api/users', vartotojai.perziuretiVartotojus);
router.get('/', vartotojai.perziuretiVisusPostus);
router.post('/', vartotojai.perziuretiVisusPostus);
router.get('/register', vartotojai.forma);
router.post('/register', autorizacija.sukurtiVartotoja);
router.get('/dashboard', vartotojai.dashboard);
router.post('/dashboard', vartotojai.dashboard);
router.get('/createnew', vartotojai.postoForma);
router.post('/createnew', vartotojai.postoForma);


module.exports = router;
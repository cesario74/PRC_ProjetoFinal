var express = require('express');
var router = express.Router();
var PlanesCrash = require('../controllers/planesCrash');
module.exports = router;

router.get('/fatalidades', async function(req, res, next) {
    var dados = await PlanesCrash.fatalidades();
    res.jsonp(dados);
});

router.get('/allDisasters', async function(req, res, next) {
    var dados = await PlanesCrash.allDisasters();
    res.jsonp(dados);
});

router.get('/top10', async function(req, res, next) {
    var dados = await PlanesCrash.top10();
    res.jsonp(dados);
});

router.get('/voo/:id', async function(req, res, next) {
    var dados = await PlanesCrash.infoVoo(req.params.id);
    res.jsonp(dados);
});

router.get('/nrCompanhias', async function(req, res, next) {
    var dados = await PlanesCrash.nrComp();
    res.jsonp(dados);
});

router.get('/nomesCompanhias', async function(req, res, next) {
    var dados = await PlanesCrash.nomeComp();
    res.jsonp(dados);
});

router.get('/infoCompanhias', async function(req, res, next) {
    var dados = await PlanesCrash.infoComp();
    res.jsonp(dados);
});

router.get('/infoCompanhia/:id', async function(req, res, next) {
    var dados = await PlanesCrash.infoComp(req.params.id);
    res.jsonp(dados);
});

router.get('/tipoAvMaisAc', async function(req, res, next) {
    var dados = await PlanesCrash.tipoAvMaisAc();
    res.jsonp(dados);
});

router.get('/anoMaisAci', async function(req, res, next) {
    var dados = await PlanesCrash.anoMaisAci();
    res.jsonp(dados);
});
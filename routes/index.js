var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/mongo', function(req, res, next) {
  res.write('mongo test');
});

/* POST home page. */
router.post('/create', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/join', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/update', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

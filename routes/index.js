var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Perspura' });
// });

router.get('/', function(req, res) {
    req.getConnection(function (err, con) {
        con.query(`SELECT *FROM artikel LIMIT 8;SELECT *FROM skor_lm WHERE id_lm
         = '1';SELECT *FROM skor_nm WHERE id_nm= '1'`,
            function (err, result) {

            res.render('index',{
                ar : result[0],
                lm : result[1],
                nm : result [2],
                title : 'Persipura'
            });
        });
    });
});

router.get('/Team', function(req, res, next) {
  req.getConnection(function (err, con) {
        con.query(`SELECT *FROM pemain WHERE posisi='Goalkeeper';SELECT *FROM pemain WHERE posisi='Defender';SELECT *FROM pemain WHERE posisi='Mildfielder';SELECT *FROM pemain WHERE posisi='Forward'`,
            function (err, result) {

            res.render('Team',{
                gk : result[0],
                df : result[1],
                mf : result[2],
                fw : result[3],
                title : 'Team'
            });
        });
    });
});

//
router.get('/contact', function(req, res, next) {
  res.render('contact', { gw: 'firman' });

});

router.post('/contact',function (req, res, next) {
    const name = req.body.nama;
    const email = req.body.email;
    const telephone = req.body.telp;
    const message = req.body.pesan;
    req.getConnection(function (error,con) {
       let q= con.query(`INSERT INTO contact (nama,email,telephone,pesan,status) VALUES (?,?,?,?,"Open")`,
            [name,email,telephone,message], function (err, result) {
                console.log('Terdapat pesan baru');
                if (err){
                    console.log(err);
                } else {
                    res.redirect('/contact');
                }
            });
       console.log(q);
    });
});

router.get('/gallery', function(req, res, next) {
  req.getConnection(function (err, con) {
        con.query(`SELECT *FROM gallery LIMIT 16`,
            function (err, result) {

            res.render('gallery',{
                gall : result,
                title : 'Gallery'
            });
        });
    });
});

var paragraphs = require('lines-to-paragraphs');

router.get('/berita/:berita',function (req,res,next) {
    req.getConnection(function (error, con) {
        var q = `SELECT *FROM artikel WHERE id_Posting = "`+req.params.berita +`"; SELECT * FROM artikel ORDER BY created_at DESC LIMIT 4`;
        con.query(q, function (err, result) {

            res.render('berita',{
                berita : result[0],
                list    : result[1],
                title : ''
            });
        });
    });

});



router.get('/berita',function (req,res,next) {
    req.getConnection(function (error, con) {
        con.query('SELECT *FROM artikel ',
            function (err, result) {

            res.render('artikel',{
                berita : result,
                title : ''
            });
        });
    });

});







module.exports = router;

var express = require('express');
const conn = require('../db');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    sess = req.session;
    if (!sess.email) {
        var Islogin = false;
    } else {
        var Islogin = true;

    }
    res.render('index', { title: 'Express', login: Islogin, email: sess.email });
});
router.get('/notice', (req, res) => {
    sess = req.session;
    let query = 'SELECT * FROM notices';
    conn.query(query, (error, result) => {
        res.render('notices', {
            title: 'Notice Board',
            login: "visitor",
            email: sess.email,
            record: result,
            message: req.flash('message'),
            result: req.flash('result')
        })
    })
})
router.get('/about', (req, res) => {
    sess = req.session;
    res.render('about', {
        title: 'About',
        login: "visitor",
        email: sess.email,
        record: [],
        message: req.flash('message'),
        result: req.flash('result')
    })
})
module.exports = router;
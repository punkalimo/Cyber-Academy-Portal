const express = require('express');
const router = express.Router();
const sha1 = require('sha-1');
const conn = require('../db');

router.get('/', (req, res) => {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/login');
    } else {
        res.render('otp', {
            title: `Set password`,
            message: req.flash('message'),
            id: req.query.id
        });
    }

});
router.post('/', (req, res) => {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/login');
    } else {
        let doubleCheck = `SELECT * FROM student_record WHERE id =${req.body.id}`;
        conn.query(doubleCheck, (err, result) => {
            if (err) throw err;
            else {
                result.forEach((element) => {
                    if (element.otp_state == 0) {
                        let password = sha1(req.body.password);
                        let update = `UPDATE student_record SET otp_state = 1, password='${password}' WHERE id=${req.body.id}`;
                        conn.query(update, (err, cb) => {
                            if (err) throw err;
                            else {
                                req.flash('message', `${element.first_name} ${element.last_name} your password has been set, you can now login`);
                                res.redirect('/login')
                                req.session.destroy();
                            }
                        });
                    } else {
                        req.flash('message', 'oops! midleware malfunction!');
                        res.redirect('/login');
                    }
                })
            }
        })
    }
})
module.exports = router;
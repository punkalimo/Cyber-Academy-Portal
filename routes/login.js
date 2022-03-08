const express = require('express');
const conn = require('../db');
const router = express.Router();
const flash = require('connect-flash');
const sha1 = require('sha-1');
const { redirect } = require('express/lib/response');

router.get('/management', (req, res) => {
    sess = req.session;
    if (sess.email == 'admin@cyber.com') {
        redirect('/management/admin');
    } else if (sess.email) {
        res.redirect('/portal');
    } else {
        res.render('login', { message: req.flash('message'), title: 'login' });
    }
})
router.post('/management', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let level = email.includes('admin@cyber.com');
    if (level) {
        let queryString = `SELECT * FROM admin WHERE email='${email}' and password = '${password}'`;
        conn.query(queryString, (err, result) => {
            if (err) {
                throw err;
            } else {
                if (result.length > 0) {
                    sess = req.session;
                    sess.email = result[0].email;
                    res.redirect('/management/admin');
                } else {
                    req.flash('message', 'Wrong Credentials Entered!');
                    res.redirect('/login/management');
                }
            }
        });
    } else {
        let queryString = `SELECT * FROM lecturers WHERE email='${email}' and password='${password}'`;
        conn.query(queryString, (err, result) => {
            if (err) throw err;
            else {
                if (result.length > 0) {
                    sess = req.session;
                    sess.email = result[0].email;
                    res.redirect('/management/lecturer')
                } else {
                    req.flash('message', 'Wrong Credentials Entered!');
                    res.redirect('/login/management');
                }
            }
        })
    }

});
router.get('/', (req, res) => {
    sess = req.session;
    if (!sess.email) {
        res.render('login', { message: req.flash('message'), title: 'login' });
    } else {
        res.redirect('/portal');
    }
});
router.post('/', (req, res) => {
    let check_email = `SELECT * FROM student_record WHERE email='${req.body.email}'`;
    conn.query(check_email, (err, result) => {
        if (err) throw err;
        else {
            if (result.length > 0) {
                result.forEach((detail) => {
                    if (detail.otp_state == 0) {
                        sess = req.session;
                        sess.email = req.body.email;
                        req.flash('message', `${detail.first_name} ${detail.last_name} enter your new password`);
                        res.redirect('otp_change/?id=' + detail.id);
                    } else if (sha1(req.body.password) == detail.password) {
                        sess = req.session;
                        sess.id = detail.id;
                        sess.email = detail.email;
                        res.redirect('/portal');
                    } else {
                        req.flash('message', 'Wrong Password Entered');
                        res.redirect('login');
                    }
                });
            } else {
                req.flash('message', 'No Student With That Email, Contact the admin');
                res.redirect('login');
            }
        }
    });
})
module.exports = router;
const express = require('express');
const { redirect } = require('express/lib/response');
const conn = require('../db');
const router = express.Router();
const flash = require('connect-flash');

router.post('/', (req, res) => {
    let query = `INSERT INTO messages(email, fullname,subject,message,date) VALUES('${req.body.email}','${req.body.fullname}','${req.body.subject}','${req.body.message}', NOW())`;
    conn.query(query, (error, result) => {
        if (error) throw error
        else {
            req.flash('message', ' ');
            res.redirect('back');
        }
    })
});



module.exports = router;
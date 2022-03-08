var express = require('express');
const conn = require('../db');
var router = express.Router();
const multer = require('multer');

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/submissions"); //important this is a direct path fron our current file to storage location
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname);
    },
});


const upload = multer({ storage: fileStorageEngine });

/* GET users listing. */
router.get('/', function(req, res, next) {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/login');
    } else {
        console.log(sess.email)
        res.render('index', {
            title: 'Portal',
            login: 'student',
            email: sess.email,
            message: req.flash('message')
        })
    }
});
router.get('/profile', (req, res) => {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/login');
    } else {
        console.log(sess.email)
        let query = `SELECT * FROM student_record WHERE email ='${sess.email}'`;
        conn.query(query, (err, result) => {
            if (err) throw err
            else {
                res.render('account', {
                    title: 'Profile',
                    login: 'student',
                    email: sess.email,
                    record: result,
                    message: req.flash('message')
                })
            }
        })

    }
})
router.get('/allocations', (req, res) => {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/login');
    } else {
        let query = `SELECT * FROM student_record WHERE email='${sess.email}'`;
        conn.query(query, (error, output) => {
            if (error) throw error
            else {
                console.log(output[0].id);
                let query = `SELECT allocations.id, programs.name, lecturers.first_name, lecturers.last_name, lecturers.phone_number, lecturers.email,allocations.coursework FROM allocations INNER JOIN programs ON allocations.program_id = programs.id INNER JOIN lecturers ON programs.lecturer_id = lecturers.id INNER JOIN student_record ON allocations.student_id=student_record.id WHERE student_record.id='${output[0].id}'`;
                conn.query(query, (error, result) => {
                    if (error) throw error
                    else {
                        console.log(result);
                        res.render('portal-allocations', {
                            title: 'Profile',
                            login: 'student',
                            email: sess.email,
                            result: result,
                            message: req.flash('message')
                        })
                    }
                })
            }
        })
    }
});
router.get('/notices', (req, res) => {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/login');
    } else {
        let query = 'SELECT * FROM notices';
        conn.query(query, (error, result) => {
            res.render('notices', {
                title: 'Notice Board',
                login: "student",
                email: sess.email,
                record: result,
                message: req.flash('message'),
                result: req.flash('result')
            })
        })

    }
})
router.get('/submissions', (req, res) => {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/login');
    } else {
        let query = `SELECT * FROM student_record WHERE email='${sess.email}'`;
        conn.query(query, (error, output) => {
            if (error) throw error
            else {
                console.log(output[0].id);
                let query = `SELECT * FROM submissions WHERE student_id='${output[0].id}'`;
                conn.query(query, (error, result) => {
                    if (error) throw error
                    else {
                        console.log(result);
                        res.render('portal-submissions', {
                            title: 'Submissions',
                            login: 'student',
                            email: sess.email,
                            result: result,
                            message: req.flash('message')
                        })
                    }
                })
            }
        })
    }
})
router.post('/allocations', upload.single('coursework'), (req, res) => {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/login');
    } else {
        let query = `SELECT * FROM student_record WHERE email='${sess.email}'`;
        conn.query(query, (err, result) => {
            if (err) throw err;
            else {
                let query2 = `INSERT INTO submissions(allocation_id,student_id,coursework, coursework_name) VALUES('${req.body.id}','${result[0].id}','${req.file.filename}','${req.body.coursework_name}')`;
                conn.query(query2, (error, output) => {
                    if (error) throw error
                    else {
                        res.redirect('/portal/submissions');
                    }
                })
            }
        })
        console.log(req.file.filename);
        console.log(req.body.id)
    }
})
router.get('/about', (req, res) => {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/login');
    } else {
        res.render('about', {
            title: 'About',
            login: "student",
            email: sess.email,
            record: [],
            message: req.flash('message'),
            result: req.flash('result')
        })

    }
})

module.exports = router;
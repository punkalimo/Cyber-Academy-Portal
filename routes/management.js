const express = require('express');
const { redirect } = require('express/lib/response');
const conn = require('../db');
const router = express.Router();
var mime = require('mime-types');
const multer = require('multer');

function password(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads"); //important this is a direct path fron our current file to storage location
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname);
    },
});


const upload = multer({ storage: fileStorageEngine });
router.get('/admin', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {

        res.render('index', { title: 'Admin', login: 'admin', email: sess.email });
    }
})
router.get('/admin/students', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        let getStudents = `SELECT * FROM student_record`;
        conn.query(getStudents, (err, result) => {
            if (err) throw err;
            else {
                const userDB = JSON.stringify(result);
                result.forEach((element) => {
                    console.log(element.first_name + " " + element.last_name);
                });
                res.render('students', {
                    title: 'Student Record',
                    login: 'admin',
                    email: sess.email,
                    record: result,
                    message: req.flash('message')
                });
            }
        });

    }
});
router.get('/admin/students/add', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        res.render('student_form', { message: req.flash('message'), title: 'Add Student', login: true, email: sess.email })
    }
});
router.post('/admin/students/add', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        let queryString = `INSERT INTO student_record(first_name, last_name, email, registration_date, otp_state) VALUES 
        ('${req.body.first_name}', '${req.body.last_name}', '${req.body.email}', NOW(), 0)`;
        conn.query(queryString, (err, result) => {
            if (err) throw err;
            else {
                req.flash('message', `${req.body.first_name}  ${req.body.last_name} has been added to the portal`);
                res.redirect('/management/admin/students');
            }
        })
    }
});
router.get('/admin/students/edit/', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        let queryString = `SELECT id,first_name, last_name, email FROM student_record WHERE id = ${req.query.id}`;
        conn.query(queryString, (err, result) => {
            if (err) throw err;
            else {
                res.render('student_edit', {
                    title: 'Edit Student',
                    login: 'admin',
                    email: sess.email,
                    record: result,
                    message: req.flash('message')
                })
            }
        });
    }
});
router.post('/admin/students/edit', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        let queryString = `UPDATE student_record SET first_name='${req.body.first_name}', 
        last_name='${req.body.last_name}', email='${req.body.email}' WHERE id = ${req.body.id}`;
        conn.query(queryString, (err, result) => {
            if (err) throw err;
            else {
                req.flash('message', 'Student Details Updated!');
                res.redirect('/management/admin/students/edit?id=' + req.body.id);
            }
        });
    }
});
router.get('/admin/students/delete/', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        let queryString = `DELETE FROM student_record WHERE id=${req.query.id}`;
        conn.query(queryString, (err, result) => {
            if (err) throw err;
            else {
                req.flash('message', 'Student Deleted From Portal');
                res.redirect('/management/admin/students/');
            }
        })
    }
});
router.get('/admin/programs', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        let query = 'SELECT programs.id, programs.name, lecturers.first_name, lecturers.last_name FROM programs INNER JOIN lecturers ON programs.lecturer_id=lecturers.id';
        conn.query(query, (error, result) => {
            if (error) throw error
            else {
                res.render('programs', {
                    title: 'Programs',
                    login: 'admin',
                    email: sess.email,
                    record: result,
                    message: req.flash('message')
                })
            }
        })

    }
})
router.get('/admin/programs/add', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        let query = "SELECT * FROM lecturers";
        conn.query(query, (error, result) => {
            if (error) throw errow
            else {
                console.log(result)
                res.render('program-add', {
                    title: 'Add Course',
                    login: 'admin',
                    email: sess.email,
                    record: result,
                    message: req.flash('message')
                })
            }
        })

    }
})
router.post('/admin/programs/add', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        let query = `INSERT INTO programs(name, lecturer_id) VALUES ('${req.body.name}','${req.body.lecturer}')`;
        conn.query(query, (error, result) => {
            if (error) throw error
            else {
                req.flash('message', 'Course Added To From Portal');
                res.redirect('/management/admin/programs');
            }
        })

    }
})
router.get('/admin/programs/delete', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        let queryString = `DELETE FROM programs WHERE id=${req.query.id}`;
        conn.query(queryString, (err, result) => {
            if (err) throw err;
            else {
                req.flash('message', 'Course deleted from Portal');
                res.redirect('/management/admin/programs');
            }
        })
    }
})
router.get('/admin/lecturers', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        let query = 'SELECT * FROM lecturers';
        conn.query(query, (error, result) => {
            if (error) throw error
            else {
                res.render('lecturers', {
                    title: 'Lecturers',
                    login: 'admin',
                    email: sess.email,
                    record: result,
                    message: req.flash('message')
                })
            }
        })
    }
})
router.get('/admin/lecturers/delete', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        let query = `DELETE FROM lecturers WHERE id ='${req.query.id}'`;
        conn.query(query, (error, result) => {
            if (error) throw error
            else {
                req.flash('message', 'Lecturer deleted from Portal');
                res.redirect('/management/admin/lecturers');
            }
        })
    }
})
router.get('/admin/lecturers/add', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        res.render('lecturers_add', {
            title: 'Lecturers',
            login: "admin",
            email: sess.email,
            record: [],
            message: req.flash('message')
        })
    }
})
router.post('/admin/lecturers/add', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        let query = `INSERT INTO lecturers(first_name,last_name,email,phone_number,password) VALUES('${req.body.first_name}','${req.body.last_name}','${req.body.email}','${req.body.phone}','${password(10)}')`;
        conn.query(query, (error, result) => {
            if (error) throw error
            else {
                req.flash('message', 'Lecturer added to Portal');
                res.redirect('/management/admin/lecturers');
            }
        })
    }
})
router.get('/admin/allocations', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        let query = 'SELECT first_name, last_name, id FROM student_record';
        conn.query(query, (error, result) => {
            if (error) throw error
            else {
                res.render('allocations', {
                    title: 'Allocations',
                    login: "admin",
                    email: sess.email,
                    record: result,
                    message: req.flash('message'),
                    result: req.flash('result')
                })
            }
        })

    }
});
router.post('/admin/allocations', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        console.log(req.file);
        console.log()
        let query = `SELECT allocations.id, programs.name, lecturers.first_name, lecturers.last_name, lecturers.phone_number, lecturers.email,allocations.coursework FROM allocations INNER JOIN programs ON allocations.program_id = programs.id INNER JOIN lecturers ON programs.lecturer_id = lecturers.id INNER JOIN student_record ON allocations.student_id=student_record.id WHERE student_record.id='${req.body.student}'`;
        conn.query(query, (error, result) => {
            if (error) throw error
            else {
                req.flash('result', result);
                res.redirect('/management/admin/allocations')
                console.log(result);
            }
        })
    }
});
router.get('/admin/allocations/add', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {

        let query1 = `SELECT first_name, last_name,id FROM student_record`;
        let query2 = `SELECT name,id from programs`;
        conn.query(query1, (error, result) => {
            if (error) throw error
            else {
                conn.query(query2, (err, response) => {
                    if (err) throw err
                    else {
                        res.render('allocation-add', {
                            title: 'Allocate Student Course',
                            login: 'admin',
                            email: sess.email,
                            student: result,
                            course: response,
                            message: req.flash('message'),
                            result: req.flash('result')
                        })
                        console.log(result, response);
                    }
                })
            }
        })
    }
});
router.post('/admin/allocations/add', upload.single('coursework'), (req, res) => {
    sess = req.session;
    if (5 > 10) {
        res.redirect('/');
    } else {
        console.log(req.file.filename);
        console.log(req.body.student)
        let query1 = `INSERT INTO allocations(student_id,program_id,coursework) VALUES ('${req.body.student}', '${req.body.course}','${req.file.filename}')`;
        conn.query(query1, (error, result) => {
            if (error) throw error
            else {
                req.flash('message', 'Student Allocated A course Sucessfully');
                res.redirect('/management/admin/allocations')
            }
        })

    }
})
router.get('/admin/allocations/delete', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        let query = `DELETE FROM allocations WHERE id = '${req.query.id}'`;
        conn.query(query, (error, result) => {
            if (error) throw error
            else {
                req.flash('message', 'Allocation Deleted');
                res.redirect('/management/admin/allocations')
            }
        })
    }
})
router.get('/admin/messages', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        let query = 'SELECT * FROM messages';
        conn.query(query, (error, message) => {
            if (error) throw error;
            else {
                res.render('messages', {
                    title: 'Message Panel',
                    login: "admin",
                    email: sess.email,
                    record: message,
                    message: req.flash('message'),
                    result: req.flash('result')

                })
            }
        })

    }
});
router.get('/admin/messages/delete', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        let query = `DELETE FROM messages WHERE id = '${req.query.id}'`;
        conn.query(query, (error, result) => {
            if (error) throw error
            else {
                req.flash('message', 'Message Deleted');
                res.redirect('/management/admin/messages')
            }
        })
    }
})
router.get('/admin/notices', (req, res) => {

    let query = 'SELECT * FROM notices';
    conn.query(query, (error, result) => {
        res.render('notices', {
            title: 'Notice Board',
            login: "admin",
            email: sess.email,
            record: result,
            message: req.flash('message'),
            result: req.flash('result')
        })
    })

});
router.post('/admin/notices', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        let query = `INSERT INTO notices(subject,message,date) VALUES ('${req.body.subject}','${req.body.message}',NOW())`;
        conn.query(query, (error, result) => {
            if (error) throw error;
            else {
                req.flash('message', 'Notice Added Sucessfully');
                res.redirect('/management/admin/notices')
            }
        })
    }
});
router.get('/admin/notices/delete', (req, res) => {
    sess = req.session;
    if (sess.email !== 'admin@cyber.com') {
        res.redirect('/');
    } else {
        let query = `DELETE FROM notices WHERE id='${req.query.id}'`;
        conn.query(query, (error, result) => {
            if (error) throw error
            else {
                req.flash('message', 'Notice Deleted Sucessfully');
                res.redirect('/management/admin/notices')
            }
        })
    }
})
router.get('/lecturer', (req, res) => {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/');
    } else {
        res.render('lecturer-profile', {
            title: 'Profile',
            login: "lecturer",
            email: sess.email,
            record: [],
            message: req.flash('message'),
            result: req.flash('result')
        })
    }

})
router.get('/lecturer/allocations', (req, res) => {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/');
    } else {
        let query1 = `SELECT * FROM lecturers WHERE email = '${sess.email}'`;
        conn.query(query1, (err, result) => {
            if (err) throw err
            else {
                let query2 = `SELECT allocations.id, programs.name, allocations.coursework FROM allocations INNER JOIN programs ON allocations.program_id = programs.id INNER JOIN lecturers ON programs.lecturer_id = lecturers.id INNER JOIN student_record ON allocations.student_id=student_record.id WHERE lecturers.id='${result[0].id}'`;
                conn.query(query2, (error, response) => {
                    if (error) throw error
                    else {
                        console.log(response)
                        res.render('lecturer-allocations', {
                            title: 'Lecturer Allocation',
                            email: sess.email,
                            record: response,
                            message: req.flash('message'),
                            result: req.flash('result')
                        })
                    }
                })
            }
        })
    }
})
router.get('/lecturer/submissions', (req, res) => {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/');
    } else {
        let query1 = `SELECT * FROM lecturers WHERE email = '${sess.email}'`;
        conn.query(query1, (err, result) => {
            if (err) throw err
            else {
                let query2 = `SELECT submissions.id,submissions.coursework, submissions.coursework_name, student_id, student_record.first_name, student_record.last_name, submissions.grade FROM submissions INNER JOIN student_record ON submissions.student_id = student_record.id INNER JOIN programs ON programs.lecturer_id ='${result[0].id}'`;
                conn.query(query2, (error, response) => {
                    res.render('lecturer-submissions', {
                        title: 'Lecturer Submissions',
                        email: sess.email,
                        record: response,
                        message: req.flash('message'),
                        result: req.flash('result')
                    })
                })
            }
        })

    }
})
router.post('/lecturer/submissions', (req, res) => {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/');
    } else {
        let query = `UPDATE submissions SET grade='${req.body.grade}' WHERE id = '${req.body.id}'`;
        conn.query(query, (error, result) => {
            if (error) throw error
            else {
                res.redirect('back');
            }
        })
    }
})
router.get('/lecturers/notices', (req, res) => {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/login');
    } else {
        let query = 'SELECT * FROM notices';
        conn.query(query, (error, result) => {
            res.render('notices', {
                title: 'Notice Board',
                login: "lecturer",
                email: sess.email,
                record: result,
                message: req.flash('message'),
                result: req.flash('result')
            })
        })

    }
})
router.get('/lecturers/home', (req, res) => {
    sess = req.session;
    if (!sess.email) {
        res.redirect('/login');
    } else {
        res.render('index', {
            title: 'Home',
            login: "lecturer",
            email: sess.email,
            record: []
        })

    }
})
module.exports = router;
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET = 'MY_SECRET_KEY'; // เปลี่ยนเป็น env ใน production

// เชื่อมต่อ MySQL
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Itzy2025',
  database: 'grammar',
});

db.connect((err) => {
  if (err) console.log('DB connect error:', err);
  else console.log('Connected to MySQL');
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'API OK' });
});

// Register
app.post('/register', async (req, res) => {
  const { email_member, first_name, last_name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO member (email_member, first_name, last_name, password) VALUES (?, ?, ?, ?)',
    [email_member, first_name, last_name, hashedPassword],
    (err, result) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Register successful' });
    }
  );
});

// Register Api
app.post('/registeradmin', async (req, res) => {
  const { email_admin, first_name, last_name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO admin (email_admin, first_name, last_name, password) VALUES (?, ?, ?, ?)',
    [email_admin, first_name, last_name, hashedPassword],
    (err, result) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Register successful' });
    }
  );
});

// Login API Member
app.post('/login', (req, res) => {
  const { email_member, password } = req.body;

  db.query(
    'SELECT * FROM member WHERE email_member = ?',
    [email_member],
    async (err, results) => {
      if (err) return res.status(400).json({ error: err.message });
      if (results.length === 0)
        return res.status(400).json({ error: 'Email not found' });

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ error: 'Wrong password' });

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email_member: user.email_member,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });
    }
  );
});

// LoginAdmin API
app.post('/loginadmin', (req, res) => {
  const { email_admin, password } = req.body;

  // ตรวจสอบว่ามีข้อมูลครบ
  if (!email_admin || !password) {
    return res.status(400).json({ error: 'Please fill all fields' });
  }

  // หาว่ามี email ในระบบไหม
  db.query(
    'SELECT * FROM admin WHERE email_admin = ?',
    [email_admin],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const admin = results[0];

      // เช็ค password กับ hash
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // สร้าง JWT
      const token = jwt.sign({ email: admin.email_admin }, SECRET, {
        expiresIn: '1h',
      });

      res.json({
        message: 'Login successful',
        token,
        admin: {
          email: admin.email_admin,
          firstName: admin.first_name,
          lastName: admin.last_name,
        },
      });
    }
  );
});



// ______________________________ MEMBER ______________________________ //

// PUT: แก้ไขโปรไฟล์สมาชิก
app.put('/member/:email_member', async (req, res) => {
  const { email_member } = req.params;
  const { first_name, last_name, password } = req.body;

  if (!first_name || !last_name) {
    return res
      .status(400)
      .json({ success: false, error: 'กรุณากรอกชื่อและนามสกุล' });
  }

  // ตรวจสอบว่ามี member อยู่
  db.query(
    'SELECT * FROM member WHERE email_member=?',
    [email_member],
    async (err, rows) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      if (rows.length === 0)
        return res
          .status(404)
          .json({ success: false, error: 'Member not found' });

      let query = 'UPDATE member SET first_name=?, last_name=?';
      const params = [first_name, last_name];

      if (password) {
        const hashed = await bcrypt.hash(password, 10);
        query += ', password=?';
        params.push(hashed);
      }

      query += ' WHERE email_member=?';
      params.push(email_member);

      db.query(query, params, (err) => {
        if (err)
          return res.status(500).json({ success: false, error: err.message });

        // ส่งข้อมูลล่าสุดกลับ
        db.query(
          'SELECT email_member, first_name, last_name FROM member WHERE email_member=?',
          [email_member],
          (err2, updatedRows) => {
            if (err2)
              return res
                .status(500)
                .json({ success: false, error: err2.message });

            res.json({
              success: true, // <-- เพิ่ม success: true
              message: 'Profile updated successfully',
              user: updatedRows[0],
            });
          }
        );
      });
    }
  );
});

//_______________________________ Admin ______________________________ //
// PUT: แก้ไขโปรไฟล์สมาชิก
app.put('/admin/:email_admin', async (req, res) => {
  const { email_admin } = req.params;
  const { first_name, last_name, password } = req.body;

  if (!first_name || !last_name) {
    return res.status(400).json({ success: false, error: 'กรุณากรอกชื่อและนามสกุล' });
  }

  db.query('SELECT * FROM admin WHERE email_admin=?', [email_admin], async (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (rows.length === 0)
      return res.status(404).json({ success: false, error: 'Member not found' });

    let query = 'UPDATE admin SET first_name=?, last_name=?';
    const params = [first_name, last_name];

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      query += ', password=?';
      params.push(hashed);
    }

    query += ' WHERE email_admin=?';
    params.push(email_admin);

    db.query(query, params, (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });

      db.query(
        'SELECT email_admin, first_name, last_name FROM admin WHERE email_admin=?',
        [email_admin],
        (err2, updatedRows) => {
          if (err2) return res.status(500).json({ success: false, error: err2.message });

          res.json({
            success: true,
            message: 'Profile updated successfully',
            admin: updatedRows[0],
          });
        }
      );
    });
  });
});


// ______________________________ TESTQUESTIONS______________________________ //

// API ดึงคำถามทั้งหมด
app.get('/testquestions', (req, res) => {
  const sql = 'SELECT * FROM test_questions';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
});

// API ดึงคำถามตาม pq_practice_id
app.get('/testquestions/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;
  const sql = 'SELECT * FROM test_questions WHERE tq_category_id = ?';
  db.query(sql, [categoryId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
});

// API ดึงคำถามทั้งหมด
app.get('/practicequestions', (req, res) => {
  const sql = 'SELECT * FROM practice_questions';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
});

// API ดึงคำถามตาม pq_practice_id
app.get('/practicequestions/:practiceId', (req, res) => {
  const practiceId = req.params.practiceId;
  const sql = 'SELECT * FROM practice_questions WHERE pq_practice_id = ?';
  db.query(sql, [practiceId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
});

//______________________________ PRACTICE______________________________ //
// GET: ดึง practice ทั้งหมด

app.get('/admin/practice', (req, res) => {
  const categoryId = parseInt(req.query.category, 10);
  let sql = 'SELECT * FROM practice';
  const params = [];

  if (!isNaN(categoryId)) {
    sql += ' WHERE p_category_id = ?';
    params.push(categoryId);
  }

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST: เพิ่ม practice
app.post('/admin/practice', (req, res) => {
  const { practice_name, category_id } = req.body;
  if (!practice_name || !category_id) {
    return res
      .status(400)
      .json({ error: 'practice_name and category_id required' });
  }

  db.query(
    'INSERT INTO practice (practice_name, p_category_id) VALUES (?, ?)',
    [practice_name, category_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Practice added', id: result.insertId });
    }
  );
});

// PUT: แก้ไข practice
app.put('/admin/practice/:id', (req, res) => {
  const id = req.params.id;
  const { practice_name, category_id } = req.body;

  db.query(
    'UPDATE practice SET practice_name = ?, p_category_id = ? WHERE practice_id = ?',
    [practice_name, category_id, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Practice updated' });
    }
  );
});

// DELETE: ลบ practice
// DELETE practice by id
app.delete('/admin/practice/:id', (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: 'Missing practice ID' });
  }

  db.query('DELETE FROM practice WHERE practice_id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Practice not found' });
    }

    res.json({ message: 'Practice deleted successfully' });
  });
});


app.get('/admin/practice/category/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  db.query(
    'SELECT * FROM practice WHERE p_category_id = ?',
    [categoryId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

//______________________________ PRACTICEQUESTIONS______________________________ //
// GET: ดึงคำถามทั้งหมด
app.get('/admin/practice/questions', (req, res) => {
  db.query('SELECT * FROM practice_questions', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET: ดึงคำถามตาม practice_id
app.get('/admin/practice/questions/:practiceId', (req, res) => {
  db.query(
    'SELECT * FROM practice_questions WHERE pq_practice_id=?',
    [req.params.practiceId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// GET: ดึงคำถามเดี่ยวตาม questionId
app.get('/admin/practice/question/:id', (req, res) => {
  const questionId = req.params.id;
  db.query(
    'SELECT * FROM practice_questions WHERE practice_Questions_id = ?',
    [questionId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0)
        return res.status(404).json({ error: 'Question not found' });
      res.json(rows[0]);
    }
  );
});

// POST: เพิ่มคำถาม
app.post('/admin/practice/questions', (req, res) => {
  const {
    practice_Questions,
    answer1,
    answer2,
    answer3,
    correct_answer,
    answer1_explanation,
    answer2_explanation,
    answer3_explanation,
    correct_explanation,
    pq_practice_id,
  } = req.body;

  db.query(
    `INSERT INTO practice_questions
    (practice_Questions, answer1, answer2, answer3, correct_answer,
    answer1_explanation, answer2_explanation, answer3_explanation, correct_explanation, pq_practice_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      practice_Questions,
      answer1,
      answer2,
      answer3,
      correct_answer,
      answer1_explanation,
      answer2_explanation,
      answer3_explanation,
      correct_explanation,
      pq_practice_id,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'เพิ่มคำถามสำเร็จ', id: result.insertId });
    }
  );
});

// PUT: อัปเดตคำถาม
app.put('/admin/practice/questions/:id', (req, res) => {
  const {
    practice_Questions,
    answer1,
    answer2,
    answer3,
    correct_answer,
    answer1_explanation,
    answer2_explanation,
    answer3_explanation,
    correct_explanation,
    pq_practice_id,
  } = req.body;

  db.query(
    `UPDATE practice_questions SET
    practice_Questions=?, answer1=?, answer2=?, answer3=?, correct_answer=?,
    answer1_explanation=?, answer2_explanation=?, answer3_explanation=?, correct_explanation=?, pq_practice_id=?
    WHERE practice_Questions_id=?`,
    [
      practice_Questions,
      answer1,
      answer2,
      answer3,
      correct_answer,
      answer1_explanation,
      answer2_explanation,
      answer3_explanation,
      correct_explanation,
      pq_practice_id,
      req.params.id,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'อัปเดตคำถามสำเร็จ' });
    }
  );
});

// DELETE: ลบคำถาม
app.delete('/admin/practice/questions/:id', (req, res) => {
  db.query(
    'DELETE FROM practice_questions WHERE practice_Questions_id=?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'ลบคำถามสำเร็จ' });
    }
  );
});

//_____________________ TESTQUESTIONS_____________________ //
// GET: ดึงคำถามทั้งหมด
app.get('/admin/test/questions', (req, res) => {
  db.query('SELECT * FROM test_questions', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET: ดึงคำถามตามหมวดหมู่
app.get('/admin/test/questions/category/:catId', (req, res) => {
  db.query(
    'SELECT * FROM test_questions WHERE tq_category_id=?',
    [req.params.catId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// POST: เพิ่มคำถาม
app.post('/admin/test/questions', (req, res) => {
  const {
    test_Questions,
    answer1,
    answer2,
    answer3,
    correct_answer,
    tq_category_id,
  } = req.body;

  db.query(
    `INSERT INTO test_questions
    (test_Questions, answer1, answer2, answer3, correct_answer, tq_category_id)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [test_Questions, answer1, answer2, answer3, correct_answer, tq_category_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'เพิ่มคำถามทดสอบสำเร็จ', id: result.insertId });
    }
  );
});

// PUT: อัปเดตคำถาม
app.put('/admin/test/questions/:id', (req, res) => {
  const {
    test_Questions,
    answer1,
    answer2,
    answer3,
    correct_answer,
    tq_category_id,
  } = req.body;

  db.query(
    `UPDATE test_questions SET
    test_Questions=?, answer1=?, answer2=?, answer3=?, correct_answer=?, tq_category_id=?
    WHERE test_Questions_id=?`,
    [
      test_Questions,
      answer1,
      answer2,
      answer3,
      correct_answer,
      tq_category_id,
      req.params.id,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'อัปเดตคำถามทดสอบสำเร็จ' });
    }
  );
});

// DELETE: ลบคำถาม
app.delete('/admin/test/questions/:id', (req, res) => {
  db.query(
    'DELETE FROM test_questions WHERE test_Questions_id=?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'ลบคำถามทดสอบสำเร็จ' });
    }
  );
});
 


// เพิ่มใน server.js หรือ routes ของคุณ

// บันทึกผลการทำแบบทดสอบ
app.post('/api/saveTestResult', async (req, res) => {
  const { total_score, t_category_id, t_email_member, test_questions } = req.body;
  
  try {
    const connection = await pool.getConnection();
    
    // บันทึกข้อมูลหลัก
    const [result] = await connection.query(
      `INSERT INTO test (total_score, date, t_category_id, t_email_member) 
       VALUES (?, NOW(), ?, ?)`,
      [total_score, t_category_id, t_email_member]
    );
    
    const testId = result.insertId;
    
    // บันทึกรายละเอียดแต่ละข้อคำถาม (ถ้าต้องการ)
    if (test_questions && test_questions.length > 0) {
      for (const questionId of test_questions) {
        await connection.query(
          `INSERT INTO test (total_score, date, t_category_id, t_email_member, t_test_questions_id) 
           VALUES (?, NOW(), ?, ?, ?)`,
          [total_score, t_category_id, t_email_member, questionId]
        );
      }
    }
    
    connection.release();
    res.json({ success: true, testId });
  } catch (error) {
    console.error('Error saving test result:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ดึงประวัติการทำแบบทดสอบ
app.get('/api/testHistory/:email', async (req, res) => {
  const { email } = req.params;
  
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT t.test_id, t.total_score, t.date, t.t_category_id, c.category_name 
       FROM test t 
       LEFT JOIN category c ON t.t_category_id = c.category_id 
       WHERE t.t_email_member = ? 
       ORDER BY t.date DESC`,
      [email]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching test history:', error);
    res.status(500).json({ message: error.message });
  }
});

 





// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

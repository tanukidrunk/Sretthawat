const express = require('express');
const mysql = require('mysql2'); 
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET = 'MY_SECRET_KEY';


let db;
(async () => {
  try {
    db = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'Itzy2025',
      database: 'grammar',
    });

    db = db.promise(); 
    console.log('Connected to MySQL');
  } catch (err) {
    console.error('DB connection failed:', err);
  }
})();

// TEST
app.get('/test', (req, res) => {
  res.json({ message: 'API OK' });
});

// MEMBER REGISTER
app.post('/register', async (req, res) => {
  try {
    const { email_member, first_name, last_name, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO member (email_member, first_name, last_name, password) VALUES (?, ?, ?, ?)',
      [email_member, first_name, last_name, hashed]
    );

    res.json({ message: 'Register successful' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// MEMBER LOGIN
app.post('/login', async (req, res) => {
  try {
    const { email_member, password } = req.body;
    const [results] = await db.query(
      'SELECT * FROM member WHERE email_member = ?',
      [email_member]
    );

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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN LOGIN
app.post('/loginadmin', async (req, res) => {
  try {
    const { email_admin, password } = req.body;

    if (!email_admin || !password)
      return res.status(400).json({ error: 'Please fill all fields' });

    const [results] = await db.query(
      'SELECT * FROM admin WHERE email_admin = ?',
      [email_admin]
    );

    if (results.length === 0)
      return res.status(401).json({ error: 'Invalid email or password' });

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ email: admin.email_admin }, SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token,
      admin: {
        email: admin.email_admin,
        firstName: admin.first_name,
        lastName: admin.last_name,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE MEMBER 
app.put('/member/:email_member', async (req, res) => {
  try {
    const { email_member } = req.params;
    const { first_name, last_name, password } = req.body;

    if (!first_name || !last_name) {
      return res.status(400).json({
        success: false,
        error: 'First name and last name are required'
      });
    }

    
    const [rows] = await db.query(
      'SELECT * FROM member WHERE email_member=?',
      [email_member]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    //สร้าง query สำหรับ update
    let query = 'UPDATE member SET first_name=?, last_name=?';
    const params = [first_name, last_name];

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      query += ', password=?';
      params.push(hashed);
    }

    query += ' WHERE email_member=?';
    params.push(email_member);

    // update database
    await db.query(query, params);

    // ดึงข้อมูลใหม่หลังอัปเดต
    const [updatedRows] = await db.query(
      'SELECT email_member, first_name, last_name FROM member WHERE email_member=?',
      [email_member]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedRows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});



// ______________________________ QUESTIONS (Promise-based) ______________________________ //
const getQueryResults = async (sql, params = []) => {
  try {
    const [rows] = await db.query(sql, params);
    return rows;
  } catch (err) {
    throw err;
  }
};

// TEST QUESTIONS
app.get('/testquestions', async (req, res) => {
  try {
    const rows = await getQueryResults('SELECT * FROM test_questions');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/testquestions/:categoryId', async (req, res) => {
  try {
    const rows = await getQueryResults(
      'SELECT * FROM test_questions WHERE tq_category_id = ?',
      [req.params.categoryId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PRACTICE QUESTIONS
app.get('/practicequestions', async (req, res) => {
  try {
    const rows = await getQueryResults('SELECT * FROM practice_questions');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/practicequestions/:practiceId', async (req, res) => {
  try {
    const rows = await getQueryResults(
      'SELECT * FROM practice_questions WHERE pq_practice_id = ?',
      [req.params.practiceId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PRACTICE CRUD
app.get('/admin/practice', async (req, res) => {
  try {
    const categoryId = parseInt(req.query.category, 10);
    let sql = 'SELECT * FROM practice';
    const params = [];
    if (!isNaN(categoryId)) {
      sql += ' WHERE p_category_id = ?';
      params.push(categoryId);
    }
    const rows = await getQueryResults(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/admin/practice', async (req, res) => {
  try {
    const { practice_name, category_id } = req.body;
    if (!practice_name || !category_id)
      return res.status(400).json({ error: 'practice_name and category_id required' });

    const result = await db.query(
      'INSERT INTO practice (practice_name, p_category_id) VALUES (?, ?)',
      [practice_name, category_id]
    );
    res.json({ message: 'Practice added', id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// SAVE TEST
app.post('/savetest', async (req, res) => {
  try {
    const { total_score, t_category_id, t_email_member } = req.body;
    if (total_score == null || t_category_id == null || !t_email_member)
      return res.status(400).json({ error: 'Missing required fields' });

    const [result] = await db.query(
      'INSERT INTO test (total_score, date, t_category_id, t_email_member) VALUES (?, NOW(), ?, ?)',
      [total_score, t_category_id, t_email_member]
    );

    res.json({ success: true, test_id: result.insertId, message: 'Test saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// HISTORY
app.get('/history', async (req, res) => {
  try {
    const rows = await getQueryResults('SELECT test_id, total_score, date, t_category_id, t_email_member FROM test ORDER BY date ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/history/:categoryId', async (req, res) => {
  try {
    const rows = await getQueryResults(
      'SELECT test_id, total_score, date, t_category_id, t_email_member FROM test WHERE t_category_id = ? ORDER BY date ASC',
      [req.params.categoryId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('? Server running on port 3000'));



// ==================== PRACTICE QUESTIONS ==================== //

// GET all practice questions
app.get('/admin/practice/questions', async (req, res) => {
  try {
    const rows = await getQueryResults('SELECT * FROM practice_questions');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET practice questions by practiceId
app.get('/admin/practice/questions/:practiceId', async (req, res) => {
  try {
    const rows = await getQueryResults(
      'SELECT * FROM practice_questions WHERE pq_practice_id = ?',
      [req.params.practiceId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single practice question by questionId
app.get('/admin/practice/question/:id', async (req, res) => {
  try {
    const rows = await getQueryResults(
      'SELECT * FROM practice_questions WHERE practice_Questions_id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Question not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add new practice question
app.post('/admin/practice/questions', async (req, res) => {
  try {
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

    const [result] = await db.query(
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
      ]
    );

    res.json({ message: 'Successfully added question', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update practice question
app.put('/admin/practice/questions/:id', async (req, res) => {
  try {
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

    await db.query(
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
      ]
    );

    res.json({ message: 'Successfully updated question' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE practice question
app.delete('/admin/practice/questions/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM practice_questions WHERE practice_Questions_id=?',
      [req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Question not found' });

    res.json({ message: 'Successfully deleted question' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== TEST QUESTIONS ==================== //

// GET all test questions
app.get('/admin/test/questions', async (req, res) => {
  try {
    const rows = await getQueryResults('SELECT * FROM test_questions');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET test questions by categoryId
app.get('/admin/test/questions/category/:catId', async (req, res) => {
  try {
    const rows = await getQueryResults(
      'SELECT * FROM test_questions WHERE tq_category_id=?',
      [req.params.catId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add new test question
app.post('/admin/test/questions', async (req, res) => {
  try {
    const { test_Questions, answer1, answer2, answer3, correct_answer, tq_category_id } = req.body;

    const [result] = await db.query(
      `INSERT INTO test_questions
      (test_Questions, answer1, answer2, answer3, correct_answer, tq_category_id)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [test_Questions, answer1, answer2, answer3, correct_answer, tq_category_id]
    );

    res.json({ message: 'Successfully added test question', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update test question
app.put('/admin/test/questions/:id', async (req, res) => {
  try {
    const { test_Questions, answer1, answer2, answer3, correct_answer, tq_category_id } = req.body;

    await db.query(
      `UPDATE test_questions SET
      test_Questions=?, answer1=?, answer2=?, answer3=?, correct_answer=?, tq_category_id=?
      WHERE test_Questions_id=?`,
      [test_Questions, answer1, answer2, answer3, correct_answer, tq_category_id, req.params.id]
    );

    res.json({ message: 'Successfully updated test question' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE test question
app.delete('/admin/test/questions/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM test_questions WHERE test_Questions_id=?',
      [req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Test question not found' });

    res.json({ message: 'Successfully deleted test question' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

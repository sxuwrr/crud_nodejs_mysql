import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';


const app = express();
const port = 3000;

// Setup the connection to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: 'crud_db',
});

// Connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Routes

// GET: Display all users
app.get('/', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('index', { users: results });
  });
});

// GET: Show create user form
app.get('/create', (req, res) => {
  res.render('create');
});

// POST: Add a new user
app.post('/create', (req, res) => {
  const { name, email, phone } = req.body;
  const sql = 'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)';
  db.query(sql, [name, email, phone], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// GET: Show edit user form
app.get('/edit/:id', (req, res) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.render('edit', { user: result[0] });
  });
});

// POST: Update user details
app.post('/edit/:id', (req, res) => {
  const { name, email, phone } = req.body;
  const sql = 'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?';
  db.query(sql, [name, email, phone, req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// GET: Delete user
app.get('/delete/:id', (req, res) => {
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

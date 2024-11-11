const { log } = require("console");
const exp = require("express");
const app = exp();
const mysql = require("mysql2");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(exp.urlencoded({ extended: true }));
app.use(exp.json());
app.use(exp.static(path.join(__dirname, "/public/style")));
app.use(exp.static(path.join(__dirname, "/public/img")));

const url = process.env.DATABASE_URL;
let blog = mysql.createConnection(url);

blog.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Table creation query
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS veer (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(40),
    email VARCHAR(60),
    para VARCHAR(10000),
    password VARCHAR(255),
    enroll VARCHAR(100),
    date DATE
  )
`;

// Create the table if it doesn't exist
blog.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");

  blog.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating table:", err);
      return;
    }
    console.log("Table 'veer' is ready.");
  });
});

// Home page
app.get("/", (req, res) => {
  let q = "SELECT * FROM veer ORDER BY date DESC";
  blog.query(q, (err, result) => {
    if (err) throw err;
    res.render("home.ejs", { users: result });
  });
});

// Add new user
app.get("/add-user", (req, res) => {
  res.render("adduser.ejs");
});

app.post("/add-user", (req, res) => {
  let id = uuidv4();
  let { name, email, para, password, enroll } = req.body;
  let q = `INSERT INTO veer (id, name, email, para, password, enroll, date) VALUES (?, ?, ?, ?, ?, ?, CURDATE())`;
  blog.query(q, [id, name, email, para, password, enroll], (err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// Delete user
app.post("/delete/:id", (req, res) => {
  const { id } = req.params;
  const userPassword = req.body.password;

  const qSelect = `SELECT password FROM veer WHERE id=?`;
  blog.query(qSelect, [id], (err, results) => {
    if (err) return res.status(500).send("Server error");

    if (results.length > 0 && results[0].password === userPassword) {
      const qDelete = `DELETE FROM veer WHERE id=?`;
      blog.query(qDelete, [id], (err) => {
        if (err) return res.status(500).send("Server error");
        res.redirect("/");
      });
    } else {
      res.render("delete.ejs");
    }
  });
});

// Edit user
app.get("/user/:id", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM veer WHERE id=?`;
  blog.query(q, [id], (err, result) => {
    if (err) throw err;
    res.render("edit.ejs", { post: result[0] });
  });
});

app.post("/update/:id", (req, res) => {
  const { id } = req.params;
  const { name, para, email, password, enroll, date } = req.body;

  const authQuery = `SELECT password FROM veer WHERE id = ?`;
  blog.query(authQuery, [id], (err, result) => {
    if (err) throw err;

    if (result.length > 0 && result[0].password === password) {
      const updateQuery = `UPDATE veer SET name = ?, para = ?, email = ?, enroll = ?, date = IFNULL(?, CURDATE()) WHERE id = ?`;
      blog.query(updateQuery, [name, para, email, enroll, date, id], (err) => {
        if (err) return res.status(500).send("Error updating post");
        res.redirect("/");
      });
    } else {
      res.render("promt.ejs", { userId: id });
    }
  });
});

// Set the port and start the server
let port = "3306";
app.listen(port, () => {
  console.log(`App is listening on port http://localhost:${port}`);
});

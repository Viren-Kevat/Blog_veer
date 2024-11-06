const { log } = require("console");
const exp = require("express");
const app = exp();
const mysql = require("mysql2");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(exp.urlencoded({ extended: true }));
app.use(exp.json());
app.use(exp.static(path.join(__dirname, "/public/style")));
app.use(exp.static(path.join(__dirname, "/public/img")));
const url = `mysql://root:iwrZxaYIINwcPMqERZPzyBvVcFDyMgHV@junction.proxy.rlwy.net:14184/railway`;
let blog = mysql.createConnection(url);

//home page
app.get("/", (req, res) => {
  let q = "SELECT * FROM USERS ORDER BY date DESC";
  try {
    blog.query(q, (err, result) => {
      if (err) throw err;
      let users = result;
      res.render("home.ejs", { users });
    });
  } catch (err) {
    console.log("error in q");
  }
});

// addnew user

app.get("/add-user", (req, res) => {
  res.render("adduser.ejs");
});

app.post("/add-user", (req, res) => {
  let id = uuidv4();
  let { name, email, para, password, enroll } = req.body;
  let q = `INSERT INTO USERS (id, name, email, para, password, enroll, date) VALUES (?, ?, ?, ?, ?, ?, CURDATE())`;
  try {
    blog.query(q, [id, name, email, para, password, enroll], (err, result) => {
      if (err) throw err;
      res.redirect("/");
    });
  } catch (err) {
    console.log("Error in adding user");
    res.json({ success: false });
  }
});

// delete user

// Route to handle post deletion

app.post("/delete/:id", (req, res) => {
  const { id } = req.params;
  const userPassword = req.body.password;

  const qSelect = `SELECT password FROM USERS WHERE id='${id}'`;
  blog.query(qSelect, (err, results) => {
    if (err) {
      console.error("Error retrieving password:", err);
      return res.status(500).send("Server error");
    }

    if (results.length > 0 && results[0].password === userPassword) {
      const qDelete = `DELETE FROM USERS WHERE id='${id}'`;
      blog.query(qDelete, (err) => {
        if (err) {
          console.error("Error deleting post:", err);
          return res.status(500).send("Server error");
        }
        res.redirect("/");
      });
    } else {
      console.log("Incorrect password provided.");
      // res.status(403).send("Incorrect password");
      res.render("delete.ejs");
    }
  });
});

// edit side

app.get("/user/:id", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM USERS WHERE id='${id}'`;
  try {
    blog.query(q, (err, result) => {
      if (err) throw err;
      let post = result[0];
      res.render("edit.ejs", { post });
    });
  } catch (err) {
    console.log("error in edit");
  }
});

app.post("/update/:id", (req, res) => {
  const { id } = req.params;
  const { name, para, email, password, enroll, date } = req.body;

  const authQuery = `SELECT PASSWORD FROM users WHERE id = ?`;

  blog.query(authQuery, [id], (err, result) => {
    if (err) throw err;

    // authantication
    if (result.length > 0 && result[0].PASSWORD === password) {
      const updateQuery = `UPDATE users SET name = ?, para = ?, email = ?,enroll=?,date = IFNULL(?, CURDATE()) WHERE id = ?`;
      blog.query(updateQuery, [name, para, email, enroll, date, id], (err) => {
        if (err) {
          console.error("Error updating post:", err);
          return res.status(500).send("Error updating post");
        }
        res.redirect("/");
      });
    } else {
      // res.send("Incorrect password.");
      res.render("promt.ejs", { userId: id });
    }
  });
});

let port = "210";
app.listen(port, () => {
  console.log(`app is listening on port http://localhost:${port}`);
});

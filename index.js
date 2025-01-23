const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public/style")));
app.use(express.static(path.join(__dirname, "/public/img")));

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Define the schema and model
const userSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  name: String,
  email: String,
  para: String,
  password: String,
  enroll: String,
  date: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// Home page
app.get("/", async (req, res) => {
  const users = await User.find().sort({ date: -1 });
  res.render("home.ejs", { users });
});

// Add new user
app.get("/add-user", (req, res) => {
  res.render("adduser.ejs");
});

app.post("/add-user", async (req, res) => {
  const { name, email, para, password, enroll } = req.body;
  const newUser = new User({ name, email, para, password, enroll });
  await newUser.save();
  res.redirect("/");
});

// Delete user
app.post("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const userPassword = req.body.password;

  const user = await User.findOne({ id });
  if (user && user.password === userPassword) {
    await User.deleteOne({ id });
    res.redirect("/");
  } else {
    res.render("delete.ejs");
  }
});

// Edit user
app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ id });
  res.render("edit.ejs", { post: user });
});

app.post("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, para, email, password, enroll, date } = req.body;

  const user = await User.findOne({ id });
  if (user && user.password === password) {
    user.name = name;
    user.para = para;
    user.email = email;
    user.enroll = enroll;
    user.date = date || Date.now();
    await user.save();
    res.redirect("/");
  } else {
    res.render("promt.ejs", { userId: id });
  }
});

// Set the port and start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is listening on port http://localhost:${port}`);
});

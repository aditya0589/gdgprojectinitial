const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Dummy users
const users = {
  athlete1: { username: "athlete1", password: "pass123", role: "athlete" },
  coach1: { username: "coach1", password: "pass123", role: "coach" },
  company1: { username: "company1", password: "pass123", role: "company" },
};

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

// Routes
app.get("/", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.redirect(`/${req.session.user.role}`);
});

app.get("/login", (req, res) => res.render("login"));

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (user && user.password === password) {
    req.session.user = user;
    return res.redirect("/");
  }
  res.send("Invalid credentials! <a href='/login'>Try again</a>");
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Role-based pages
app.get("/athlete", requireAuth, (req, res) => {
  if (req.session.user.role === "athlete") res.render("athlete");
  else res.send("Access Denied");
});

app.get("/coach", requireAuth, (req, res) => {
  if (req.session.user.role === "coach") res.render("coach");
  else res.send("Access Denied");
});

app.get("/company", requireAuth, (req, res) => {
  if (req.session.user.role === "company") res.render("company");
  else res.send("Access Denied");
});

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

const users = {};

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function isValidPassword(password) {
  return password && password.length >= 6;
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/signup.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});
app.get("/landing", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/landing.html"));
});

app.post("/signup", (req, res) => {
  const { firstName, lastName, email, birthdate, password, repassword } = req.body;

  if (!firstName || !lastName || !email || !birthdate || !password || !repassword) {
    return res.send("All fields are required");
  }
  if (!isValidEmail(email)) {
    return res.send("Invalid email address");
  }
  if (!isValidPassword(password)) {
    return res.send("Password must be at least 6 characters");
  }
  if (password !== repassword) {
    return res.send("Passwords do not match");
  }
  if (users[email]) {
    return res.send("User already exists");
  }

  users[email] = { firstName, lastName, email, birthdate, password };
  console.log("New user registered:", users[email]);
  res.redirect("/login");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send("Email and password are required");
  }

  const user = users[email];
  if (!user || user.password !== password) {
    return res.send("Invalid email or password");
  }

  console.log("User logged in:", email);

  res.redirect("/landing");
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

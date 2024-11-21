import express from "express";
import session from "express-session";
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  hashPassword,
  verifyPassword,
} from "./backend/database.js";

const app = express();
const PORT = process.env.EXPRESS_PORT || 3000;

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 6000 * 60,
    },
  })
);

app.get("/users", async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const users = await getUserById(userId);
  res.json(users);
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await hashPassword(password);
  const createdUser = await createUser(email, hashedPassword);
  res.json(createdUser);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  req.session.visted = true;
  req.session.user = {
    id: user.id,
    email: user.email,
  };

  console.log(req.session);
  console.log(req.session.id);
  res.json({
    message: "Login successful",
    user: { id: user.id, email: user.email },
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

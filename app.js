import express from "express";
import { getAllUsers, getUserById, createUser } from "./database.js";
const app = express();
const PORT = process.env.EXPRESS_PORT || 3000;

app.use(express.json());

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
  const createdUser = await createUser(email, password);
  res.json(createdUser);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

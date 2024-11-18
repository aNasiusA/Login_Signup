import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
  .promise();

async function getAllUsers() {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
}
async function getUserById(id) {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
}

async function createUser(email, password) {
  const [result] = await pool.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, password]
  );
  const id = result.insertId;
  return getUserById(id);
}

export { getAllUsers, getUserById, createUser };

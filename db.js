// db.js
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",          // your MySQL username
  password: "Pratiksha@123", // your MySQL password
  database: "mini" // your database name
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database!");
  }
});

module.exports = connection;

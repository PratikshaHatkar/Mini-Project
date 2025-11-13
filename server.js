import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { Router } from "express";




const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use("/", router);
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Pratiksha@123",
  database: "mini",
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ MySQL Connected!");
});

// ✅ Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

// ✅ SIGNUP API
app.post("/signup", async (req, res) => {
  const { role, name, email, password, address, city, phone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const table = role === "admin" ? "admin" : "users";

  const sql = `INSERT INTO ${table} (name, email, password, address, city, phone)
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [name, email, hashedPassword, address, city, phone], (err) => {
    if (err) {
      console.error("❌ Signup Error:", err);
      return res.status(500).json({ message: "Signup failed" });
    }
    res.json({ message: `${role} registered successfully!` });
  });
});

// ✅ LOGIN API
app.post("/login", (req, res) => {
  const { role, email, password } = req.body;
  const table = role === "admin" ? "admin" : "users";

  db.query(`SELECT * FROM ${table} WHERE email = ?`, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length === 0) return res.status(400).json({ message: "User not found" });

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    res.json({
      message: `${role} logged in successfully!`,
      role,
      user: { id: user.user_id || user.admin_id, name: user.name, email: user.email },
    });
  });
});


router.get("/api/medicines", async (req, res) => {
  const keyword = req.query.symptom;
  const query = `
    SELECT 
      s.name AS symptom,
      m.name AS medicine_name,
      m.usage_info,
      c.company_name,
      GROUP_CONCAT(DISTINCT comp.ingredient SEPARATOR ', ') AS ingredients,
      m.image_path
    FROM symptoms s
    JOIN symptoms_medicine sm ON s.symptom_id = sm.symptom_id
    JOIN medicines m ON sm.medicine_id = m.medicine_id
    JOIN company_master c ON m.company_id = c.company_id
    JOIN composition comp ON m.medicine_id = comp.medicine_id
    WHERE s.name LIKE ? OR m.name LIKE ? OR c.company_name LIKE ?
    GROUP BY m.medicine_id, s.name
  `;
  db.query(query, [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


// ✅ MEDICINE SEARCH API
// app.get("/api/medicines", (req, res) => {
//   const keyword = req.query.symptom;
//   if (!keyword) {
//     return res.status(400).json({ error: "Please enter a search term" });
//   }

//   const sql = `
//     SELECT
//       s.name AS symptom,
//       m.medicine_id,
//       m.name AS medicine_name,
//       m.usage_info,
//       m.image_path,
//       cm.company_name,
//       GROUP_CONCAT(DISTINCT c.ingredient SEPARATOR ', ') AS ingredients
//     FROM symptoms s
//     JOIN symptoms_medicine sm ON s.symptom_id = sm.symptom_id
//     JOIN medicines m ON sm.medicine_id = m.medicine_id
//     LEFT JOIN company_master cm ON m.company_id = cm.company_id
//     LEFT JOIN composition c ON m.medicine_id = c.medicine_id
//     WHERE s.name LIKE CONCAT('%', ?, '%')
//        OR m.name LIKE CONCAT('%', ?, '%')
//        OR cm.company_name LIKE CONCAT('%', ?, '%')
//     GROUP BY s.name, m.medicine_id, m.name, m.usage_info, m.image_path, cm.company_name
//     ORDER BY m.name;
//   `;

//   db.query(sql, [keyword, keyword, keyword], (err, results) => {
//     if (err) {
//       console.error("❌ Query Error:", err);
//       return res.status(500).json({ error: "Database query failed" });
//     }
//     res.json(results);
//   });
// });

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));








// import express from "express";
// import mysql from "mysql2";
// import cors from "cors";
// import bcrypt from "bcrypt";
// import bodyParser from "body-parser";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, "public")));

// // ✅ Default route → opens signup page
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "signup.html"));
// });

// // ✅ MySQL connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Pratiksha@123",
//   database: "mini",
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log("✅ MySQL Connected!");
// });

// // ✅ Signup API
// app.post("/signup", async (req, res) => {
//   const { role, name, email, password, address, city, phone } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const table = role === "admin" ? "admin" : "users";

//   const sql = `INSERT INTO ${table} (name, email, password, address, city, phone)
//                VALUES (?, ?, ?, ?, ?, ?)`;

//   db.query(sql, [name, email, hashedPassword, address, city, phone], (err) => {
//     if (err) {
//       console.error("Signup Error:", err);
//       return res.status(500).json({ message: "Signup failed" });
//     }
//     res.json({ message: `${role} registered successfully!` });
//   });
// });

// // ✅ Login API
// app.post("/login", (req, res) => {
//   const { role, email, password } = req.body;
//   const table = role === "admin" ? "admin" : "users";

//   db.query(`SELECT * FROM ${table} WHERE email = ?`, [email], async (err, result) => {
//     if (err) return res.status(500).json({ message: "Database error" });
//     if (result.length === 0) return res.status(400).json({ message: "User not found" });

//     const user = result[0];
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) return res.status(400).json({ message: "Invalid password" });

//     res.json({
//       message: `${role} logged in successfully!`,
//       user: { id: user.user_id || user.admin_id, name: user.name, email: user.email },
//     });
//   });
// });

// app.listen(5000, () => console.log("🚀 Server running on port 5000"));








// import express from "express";
// import mysql from "mysql2";
// import cors from "cors";
// import bcrypt from "bcrypt";
// import bodyParser from "body-parser";
// import path from "path";
// import { fileURLToPath } from "url";
// // ✅ Static File Setup
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);




// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());

// app.use(express.static(path.join(__dirname, "public")));

// // Default route
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// // ✅ Connect to MySQL
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Pratiksha@123",
//   database: "mini",
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log("✅ MySQL Connected!");
// });


// // ✅ Signup API
// app.post("/signup", async (req, res) => {
//   const { role, name, email, password, address, city, phone } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);

//   const table = role === "admin" ? "admin" : "users";
//   const sql = `INSERT INTO ${table} (name, email, password, address, city, phone)
//                VALUES (?, ?, ?, ?, ?, ?)`;

//   db.query(sql, [name, email, hashedPassword, address, city, phone], (err) => {
//     if (err) {
//       console.error("Signup Error:", err);
//       return res.status(500).json({ message: "Signup failed" });
//     }
//     res.json({ message: `${role} registered successfully!` });
//   });
// });


// // ✅ Login API
// app.post("/login", (req, res) => {
//   const { role, email, password } = req.body;
//   const table = role === "admin" ? "admin" : "users";

//   db.query(`SELECT * FROM ${table} WHERE email = ?`, [email], async (err, result) => {
//     if (err) return res.status(500).json({ message: "Database error" });
//     if (result.length === 0) return res.status(400).json({ message: "User not found" });

//     const user = result[0];
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid password" });
//     }

//     res.json({
//       message: `${role} logged in successfully!`,
//       user: { id: user.user_id || user.admin_id, name: user.name, email: user.email },
//     });
//   });
// });


// // ✅ Start Server
// app.listen(5000, () => console.log("🚀 Server running on port 5000"));















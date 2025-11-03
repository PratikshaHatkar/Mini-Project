const express = require("express");
const mysql = require("mysql");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Connect to MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Pratiksha@123",  // your MySQL password
  database: "Miniproject"        // your DB name
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL connected!");
});

// Serve index.html on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.get("/api/medicines", (req, res) => {
  const { symptom } = req.query;
  if (!symptom) return res.status(400).json({ error: "Symptom name required" });

  const sql = `
    SELECT 
        s.name AS Symptom,
        m.name AS Medicine_Name,
        m.usage_info AS Usage_Info,
        c.company_name AS Company,
        GROUP_CONCAT(DISTINCT comp.ingredient SEPARATOR ', ') AS Composition
    FROM symptoms s
    JOIN symptoms_medicine sm ON s.symptom_id = sm.symptom_id
    JOIN medicines m ON sm.med_id = m.medicine_id
    LEFT JOIN company c ON m.medicine_id = c.medicine_id
    LEFT JOIN composition comp ON m.medicine_id = comp.medicine_id
    WHERE s.name LIKE ?
    GROUP BY s.name, m.name, m.usage_info, c.company_name
  `;

  db.query(sql, [`%${symptom}%`], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
});



// // Search medicines by symptom name
// app.get("/api/medicines", (req, res) => {
//   const { symptom } = req.query;

//   if (!symptom) {
//     return res.status(400).json({ error: "Symptom name required" });
//   }

//   const sql = `
//     SELECT 
//       s.name AS Symptom,
//       m.name AS Medicine_Name,
//       m.company AS Company,
//       m.composition AS Composition,
//       m.usage_info AS Usage_info,
//       m.img_uri AS Image
//     FROM symptoms s
//     JOIN symptoms_medicine sm ON s.symptom_id = sm.symptom_id
//     JOIN medicines m ON sm.med_id = m.medicine_id
//     WHERE s.name LIKE ? AND m.is_active = 1
//   `;

//   db.query(sql, [`%${symptom}%`], (err, results) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ error: "Database error" });
//     }

//     res.json(results);
//   });
// });



// Example API to get data from MySQL table "medicines"
// app.get("/medicines", (req, res) => {
//   db.query("SELECT * FROM medicines", (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// });

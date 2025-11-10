const express = require("express");
const mysql = require("mysql");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Pratiksha@123",
  database: "miniproject"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
  console.log("✅ MySQL Connected!");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/api/medicines", (req, res) => {
  const symptom = req.query.symptom;
  console.log("🩺 Received symptom:", symptom);

  if (!symptom) {
    return res.status(400).json({ error: "Symptom name is required" });
  }

  // Using LEFT JOIN so we still return medicines even if company or composition missing.
  // GROUP_CONCAT(DISTINCT ...) removes duplicates.
  // Group by medicine_id (unique medicine) and symptom name.
  const sql = `
    SELECT
      s.name AS symptom,
      m.medicine_id AS medicine_id,
      m.name AS medicine_name,
      m.usage_info AS usage_info,
      GROUP_CONCAT(DISTINCT cm.company_name SEPARATOR ',') AS companies,
      GROUP_CONCAT(DISTINCT c.ingredient SEPARATOR ',') AS ingredients
    FROM symptoms s
    JOIN symptoms_medicine sm ON s.symptom_id = sm.symptom_id
    JOIN medicines m ON sm.med_id = m.medicine_id
    LEFT JOIN medicine_company mc ON m.medicine_id = mc.medicine_id
    LEFT JOIN company_master cm ON mc.company_id = cm.company_id
    LEFT JOIN composition c ON m.medicine_id = c.medicine_id
    WHERE s.name LIKE CONCAT('%', ?, '%')
    GROUP BY s.name, m.medicine_id, m.name, m.usage_info
    ORDER BY m.name;
  `;

  db.query(sql, [symptom], (err, results) => {
    if (err) {
      console.error("❌ Database query failed:", err);
      return res.status(500).json({ error: "Database query failed", details: err.sqlMessage || err });
    }

    // Convert comma strings to arrays for nicer JSON structure
    const cleaned = results.map(row => ({
      symptom: row.symptom,
      medicine_id: row.medicine_id,
      medicine_name: row.medicine_name,
      usage_info: row.usage_info,
      companies: row.companies ? row.companies.split(',').map(s => s.trim()) : [],
      ingredients: row.ingredients ? row.ingredients.split(',').map(s => s.trim()) : []
    }));

    console.log(`✅ Found ${cleaned.length} result(s) for "${symptom}"`);
    res.json(cleaned);
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



// const express = require("express");
// const mysql = require("mysql");
// const path = require("path");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.static(path.join(__dirname, "public")));

// // ✅ Database connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Pratiksha@123",
//   database: "miniproject"
// });

// db.connect((err) => {
//   if (err) {
//     console.error("❌ Database connection failed:", err);
//     process.exit(1);
//   }
//   console.log("✅ MySQL Connected!");
// });

// // ✅ Serve frontend
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "home.html"));
// });

// // ✅ API route
// app.get("/api/medicines", (req, res) => {
//   const symptom = req.query.symptom;
//   console.log("🩺 Received symptom:", symptom);

//   if (!symptom) {
//     return res.status(400).json({ error: "Symptom name is required" });
//   }

//   // ✅ Updated query for your normalized schema
//   const sql = `
//     SELECT
//         s.name AS Symptom,
//         m.name AS Medicine_Name,
//         GROUP_CONCAT(DISTINCT cm.company_name SEPARATOR ', ') AS Company,
//         GROUP_CONCAT(DISTINCT c.ingredient SEPARATOR ', ') AS Composition,
//         m.usage_info AS Usage_Info
//     FROM symptoms s
//     JOIN symptoms_medicine sm ON s.symptom_id = sm.symptom_id
//     JOIN medicines m ON sm.med_id = m.medicine_id
//     JOIN medicine_company mc ON m.medicine_id = mc.medicine_id
//     JOIN company_master cm ON mc.company_id = cm.company_id
//     JOIN composition c ON m.medicine_id = c.medicine_id
//     WHERE s.name LIKE CONCAT('%', ?, '%')
//     GROUP BY s.name, m.name, m.usage_info;
//   `;

//   db.query(sql, [symptom], (err, results) => {
//     if (err) {
//       console.error("❌ Database query failed:", err.sqlMessage);
//       return res.status(500).json({ error: "Database query failed", details: err.sqlMessage });
//     }

//     console.log(`✅ Found ${results.length} result(s) for "${symptom}"`);
//     res.json(results);
//   });
// });

// // ✅ Start server
// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));









// // server.js
// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ✅ MySQL connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Pratiksha@123",       // Add your MySQL password if you have one
//   database: "miniproject"  // Change to your DB name
// });

// // ✅ Check DB connection
// db.connect((err) => {
//   if (err) {
//     console.error("❌ Database connection failed:", err);
//   } else {
//     console.log("✅ Connected to MySQL Database!");
//   }
// });

// // ✅ Route to get medicine details by symptom
// app.get("/api/medicines", (req, res) => {
//   const symptom = req.query.symptom;

//   if (!symptom) {
//     return res.status(400).json({ error: "Symptom parameter is required" });
//   }

//   const sql = `
//     SELECT
//         s.name AS Symptom,
//         m.name AS Medicine_Name,
//         GROUP_CONCAT(DISTINCT cm.company_name SEPARATOR ', ') AS Company,
//         GROUP_CONCAT(DISTINCT comp.ingredient SEPARATOR ', ') AS Composition,
//         m.usage_info AS Usage_Info
//     FROM symptoms s
//     JOIN symptoms_medicine sm ON s.symptom_id = sm.symptom_id
//     JOIN medicines m ON sm.med_id = m.medicine_id
//     JOIN medicine_company mc ON m.medicine_id = mc.medicine_id
//     JOIN company_master cm ON mc.company_id = cm.company_id
//     JOIN composition comp ON m.medicine_id = comp.medicine_id
//     WHERE s.name LIKE CONCAT('%', ?, '%')
//     GROUP BY s.name, m.name, m.usage_info;
//   `;

//   db.query(sql, [symptom], (err, results) => {
//     if (err) {
//       console.error("❌ Database query failed:", err);
//       return res.status(500).json({ error: "Database query failed" });
//     }
//     res.json(results);
//   });
// });

// // ✅ Default route
// app.get("/", (req, res) => {
//   res.send("Ayurvedic Medicine Finder API is running ✅");
// });

// // ✅ Start server
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });




// server.js
// const express = require("express");
// const mysql = require("mysql");
// const path = require("path");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Serve frontend files from "public" folder
// app.use(express.static(path.join(__dirname, "public")));

// // ✅ MySQL Connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Pratiksha@123", // your MySQL password
//   database: "Miniproject",   // your DB name
// });

// db.connect((err) => {
//   if (err) {
//     console.error("❌ MySQL Connection Error:", err);
//     return;
//   }
//   console.log("✅ MySQL Connected!");
// });

// // ✅ Serve index page
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "home.html"));
// });

// // ✅ API route to fetch medicines by symptom
// app.get("/api/medicines", (req, res) => {
//   const symptom = req.query.symptom;
//   console.log("🩺 Received symptom:", symptom);

//   if (!symptom || symptom.trim() === "") {
//     return res.status(400).json({ error: "Symptom name is required." });
//   }

//   const sql = `
//     SELECT
//         s.name AS Symptom,
//         m.name AS Medicine_Name,
//         GROUP_CONCAT(DISTINCT cm.company_name SEPARATOR ', ') AS Company,
//         GROUP_CONCAT(DISTINCT comp.ingredient SEPARATOR ', ') AS Composition,
//         m.usage_info AS Usage_Info
//     FROM symptoms s
//     JOIN symptoms_medicine sm ON s.symptom_id = sm.symptom_id
//     JOIN medicines m ON sm.med_id = m.medicine_id
//     JOIN medicine_company mc ON m.medicine_id = mc.medicine_id
//     JOIN company_master cm ON mc.company_id = cm.company_id
//     JOIN composition comp ON m.medicine_id = comp.medicine_id
//     WHERE s.name LIKE CONCAT('%', ?, '%')
//     GROUP BY s.name, m.name, m.usage_info;
//   `;

//   db.query(sql, [symptom], (err, results) => {
//     if (err) {
//       console.error("❌ Database query failed:", err); // log full error
//       return res.status(500).json({ error: err.sqlMessage }); // send full message
//     }
//     res.json(results);
//   });
  
// // ✅ Start server
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });




// const express = require("express");
// const mysql = require("mysql");
// const path = require("path");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Serve frontend files from "public" folder
// app.use(express.static(path.join(__dirname, "public")));

// // Connect to MySQL
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Pratiksha@123",  // your MySQL password
//   database: "Miniproject"        // your DB name
// });

// db.connect(err => {
//   if (err) throw err;
//   console.log("MySQL connected!");
// });

// // Serve index.html on root
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "home.html"));
// });

// // Start server
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// app.get('/api/medicines', (req, res) => {
//   const symptom = req.query.symptom;
//   console.log("🩺 Received symptom:", symptom); // <-- Add this line

//   const sql = `
//     SELECT
//         s.name AS Symptom,
//         m.name AS Medicine_Name,
//         GROUP_CONCAT(DISTINCT cm.company_name SEPARATOR ', ') AS Company,
//         GROUP_CONCAT(DISTINCT comp.ingredient SEPARATOR ', ') AS Composition,
//         m.usage_info AS Usage_Info
//     FROM symptoms s
//     JOIN symptoms_medicine sm ON s.symptom_id = sm.symptom_id
//     JOIN medicines m ON sm.med_id = m.medicine_id
//     JOIN medicine_company mc ON m.medicine_id = mc.medicine_id
//     JOIN company_master cm ON mc.company_id = cm.company_id
//     JOIN composition comp ON m.medicine_id = comp.medicine_id
//     WHERE s.name LIKE CONCAT('%', ?, '%')
//     GROUP BY s.name, m.name, m.usage_info;
//   `;

//   db.query(sql, [symptom], (err, results) => {
//     if (err) {
//       console.error('❌ Database error:', err.sqlMessage);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     console.log(`✅ Found ${results.length} result(s) for symptom: ${symptom}`);
//     res.json(results);
//   });
// });


// app.get('/api/medicines', (req, res) => {
//   const symptom = req.query.symptom;

//   const sql = `
//     SELECT
//         s.name AS Symptom,
//         m.name AS Medicine_Name,
//         GROUP_CONCAT(DISTINCT cm.company_name SEPARATOR ', ') AS Company,
//         GROUP_CONCAT(DISTINCT comp.ingredient SEPARATOR ', ') AS Composition,
//         m.usage_info AS Usage_Info
//     FROM symptoms s
//     JOIN symptoms_medicine sm ON s.symptom_id = sm.symptom_id
//     JOIN medicines m ON sm.med_id = m.medicine_id
//     JOIN medicine_company mc ON m.medicine_id = mc.medicine_id
//     JOIN company_master cm ON mc.company_id = cm.company_id
//     JOIN composition comp ON m.medicine_id = comp.medicine_id
//     WHERE s.name LIKE CONCAT('%', ?, '%')
//     GROUP BY s.name, m.name, m.usage_info;
//   `;

//   db.query(sql, [symptom], (err, results) => {
//     if (err) {
//       console.error('Error fetching medicines:', err);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     res.json(results);
//   });
// });


// app.get("/api/medicines", (req, res) => {
//   const { symptom } = req.query;
//   if (!symptom) return res.status(400).json({ error: "Symptom name required" });

//   const sql = `
//     SELECT 
//         s.name AS Symptom,
//         m.name AS Medicine_Name,
//         m.usage_info AS Usage_Info,
//         c.company_name AS Company,
//         GROUP_CONCAT(DISTINCT comp.ingredient SEPARATOR ', ') AS Composition
//     FROM symptoms s
//     JOIN symptoms_medicine sm ON s.symptom_id = sm.symptom_id
//     JOIN medicines m ON sm.med_id = m.medicine_id
//     LEFT JOIN company c ON m.medicine_id = c.medicine_id
//     LEFT JOIN composition comp ON m.medicine_id = comp.medicine_id
//     WHERE s.name LIKE ?
//     GROUP BY s.name, m.name, m.usage_info, c.company_name
//   `;

//   db.query(sql, [`%${symptom}%`], (err, results) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ error: "Database query failed" });
//     }
//     res.json(results);
//   });
// });


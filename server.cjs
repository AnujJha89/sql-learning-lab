const mysql = require("mysql2/promise");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

app.get("/test", (req, res) => {
  res.send("Server is working");
});

let db;

let auditLogs = [];


function getQueryType(query) {
  return query.trim().split(" ")[0].toUpperCase();
}

function explainQuery(query) {
  const type = getQueryType(query);

  const explanations = {
    SELECT: "You retrieved data from a table.",
    INSERT: "You inserted new data into a table.",
    UPDATE: "You updated existing records.",
    DELETE: "You deleted records from a table.",
    CREATE: "You created a new table or database object.",
    DROP: "You deleted a table or database object.",
    ALTER: "You modified table structure.",
    TRUNCATE: "You removed all rows from a table instantly.",
  };

  return explanations[type] || "Query executed.";
}


async function initDB() {
  
  await db.query(`
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50),
      age INT
    )
  `);


  await db.query(`
    CREATE TABLE IF NOT EXISTS courses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(100)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS enrollments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      course_id INT,
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (course_id) REFERENCES courses(id)
    )
  `);


  await db.query(`
    INSERT INTO students (name, age)
    SELECT * FROM (SELECT 'Anuj', 21 UNION SELECT 'Rahul', 22) AS tmp
    WHERE NOT EXISTS (SELECT * FROM students);
  `);

  await db.query(`
    INSERT INTO courses (title)
    SELECT * FROM (SELECT 'DBMS' UNION SELECT 'OS') AS tmp
    WHERE NOT EXISTS (SELECT * FROM courses);
  `);

  await db.query(`
    INSERT INTO enrollments (student_id, course_id)
    SELECT * FROM (
      SELECT 1 AS student_id, 1 AS course_id
      UNION
      SELECT 2, 2
    ) AS tmp
    WHERE NOT EXISTS (SELECT * FROM enrollments);
  `);
}


async function startServer() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true,
    });

    await db.query("CREATE DATABASE IF NOT EXISTS dbms_lab");
    await db.query("USE dbms_lab");

    console.log("✅ MySQL connected");

    await initDB();

    // ===========================
    // ROUTES
    // ===========================
    
    function analyzeQuery(query) {
      const q = query.trim().toUpperCase();

      return {
        type: q.split(" ")[0],
        isSelect: q.startsWith("SELECT"),
        isJoin: q.includes("JOIN"),
        isSubquery: q.includes("SELECT") && q.includes("("),
        isDangerous:
          q.includes("DROP DATABASE") ||
          q.includes("DROP SCHEMA") ||
          q.includes("SHUTDOWN") ||
          q.includes("ALTER USER") ||
          q.includes("MYSQL."),
      };
    }

    app.post("/query", async (req, res) => {
      try {
        const { query } = req.body;

        if (!query || !query.trim()) {
          return res.status(400).json({
            success: false,
            error: "No query provided",
          });
        }

        const upperQuery = query.toUpperCase();

        const analysis = analyzeQuery(query);
        const type = analysis.type;
        
        if (analysis.isDangerous) {
          return res.status(403).json({
            success: false,
            error: "System-level query blocked ",
          });
        }
        
        if (analysis.type === "DELETE" && !upperQuery.includes("WHERE")) {
          return res.status(400).json({
            success: false,
            error: "DELETE without WHERE is not allowed",
          });
        }

        if (analysis.type === "UPDATE" && !upperQuery.includes("WHERE")) {
          return res.status(400).json({
            success: false,
            error: "UPDATE without WHERE is not allowed",
          });
        }

        // ⏱️ START TIMER
        const start = Date.now();

        const [rows] = await db.query(query);
        auditLogs.push({
          query,
          time: new Date().toLocaleTimeString(),
        });

        if (auditLogs.length > 50) {
          auditLogs.shift(); // keep last 50 only
        }

        // ⏱️ END TIMER HERE
        const executionTime = Date.now() - start;

        if (type === "SELECT") {
          return res.json({
            success: true,
            rows: rows || [],
            message: rows.length === 0 ? "No data found" : null,
            executionTime: `${executionTime} ms`,
            explanation: explainQuery(query),
          });
        }

        return res.json({
          success: true,
          message: "Query executed successfully",
          affectedRows: rows.affectedRows || 0,
          executionTime: `${executionTime} ms`,
          explanation: explainQuery(query),
        });
      } catch (err) {
        console.error("SQL ERROR:", err.message);

        res.status(400).json({
          success: false,
          error: err.message,
        });
      }
    });

    app.post("/reset", async (req, res) => {
      try {
        await db.query("SET FOREIGN_KEY_CHECKS = 0");

        await db.query("TRUNCATE TABLE enrollments");
        await db.query("TRUNCATE TABLE students");
        await db.query("TRUNCATE TABLE courses");

        await db.query("SET FOREIGN_KEY_CHECKS = 1");

        await initDB();

        res.json({ success: true, message: "Database reset" });
      } catch (err) {
        res.json({ success: false, error: err.message });
      }
    });

    app.get("/tables", async (req, res) => {
      try {
        const [students] = await db.query("SELECT * FROM students");
        const [courses] = await db.query("SELECT * FROM courses");
        const [enrollments] = await db.query("SELECT * FROM enrollments");

        res.json({
          success: true,
          data: {
            students,
            courses,
            enrollments,
          },
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          error: err.message,
        });
      }
    });
    app.get("/logs", (req, res) => {
      res.json({
        success: true,
        logs: auditLogs,
      });
    });

    // 🔥 ONLY ONE LISTEN HERE
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
}
process.on("SIGINT", async () => {
  console.log("\n🔌 Closing DB connection...");
  if (db) await db.end();
  process.exit(0);
});

startServer();

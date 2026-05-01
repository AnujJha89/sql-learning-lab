function $(id) {
  return document.getElementById(id);
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");

  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.padding = "10px 16px";
  toast.style.borderRadius = "6px";
  toast.style.color = "#fff";
  toast.style.fontSize = "14px";
  toast.style.zIndex = "9999";
  toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";

  if (type === "success") toast.style.background = "#28a745";
  else if (type === "error") toast.style.background = "#dc3545";
  else toast.style.background = "#333";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

let TABLE_CACHE = {};

// ================= THEORY DATA =================
const THEORY_DATA = {
  // ================= DDL =================
  // ================= DDL =================

  // ================= DDL =================

  create_table: {
    title: "CREATE TABLE",
    description:
      "CREATE TABLE is used to create a new table with defined columns and data types.",

    syntax: `CREATE TABLE table_name (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  age INT
);`,

    points: [
      "Defines structure of table",
      "Each column must have a datatype",
      "Constraints can be added during creation",
    ],

    example: `CREATE TABLE students (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  age INT
);`,

    real: "Used when designing database schema like users, products, orders.",

    warning: "Wrong datatype selection can cause data inconsistency.",
  },

  alter_add: {
    title: "ALTER TABLE (ADD COLUMN)",
    description: "Adds a new column to an existing table.",

    syntax: `ALTER TABLE table_name
ADD column_name datatype;`,

    points: ["Used to extend table structure", "Does not remove existing data"],

    example: `ALTER TABLE students
ADD email VARCHAR(100);`,

    real: "Used when new feature requires extra data field.",

    warning: "Too many columns make table harder to manage.",
  },

  alter_modify: {
    title: "ALTER TABLE (MODIFY COLUMN)",
    description: "Modifies datatype or size of an existing column.",

    syntax: `ALTER TABLE table_name
MODIFY column_name datatype;`,

    points: [
      "Changes column structure",
      "Used to increase size or change type",
    ],

    example: `ALTER TABLE students
MODIFY name VARCHAR(100);`,

    real: "Used when data requirement changes over time.",

    warning: "Incompatible datatype change may cause data loss.",
  },

  alter_drop: {
    title: "ALTER TABLE (DROP COLUMN)",
    description: "Removes a column from a table.",

    syntax: `ALTER TABLE table_name
DROP COLUMN column_name;`,

    points: [
      "Deletes column permanently",
      "Removes all data inside that column",
    ],

    example: `ALTER TABLE students
DROP COLUMN age;`,

    real: "Used when a column is no longer needed.",

    warning: "This operation cannot be undone.",
  },

  drop_table: {
    title: "DROP TABLE",
    description: "Deletes the entire table including its data.",

    syntax: `DROP TABLE table_name;`,

    points: ["Removes table completely", "Deletes structure and data"],

    example: `DROP TABLE students;`,

    real: "Used when table is no longer required.",

    warning: "This is irreversible.",
  },

  truncate: {
    title: "TRUNCATE TABLE",
    description:
      "Removes all rows from a table quickly without deleting structure.",

    syntax: `TRUNCATE TABLE table_name;`,

    points: [
      "Faster than DELETE",
      "Resets AUTO_INCREMENT",
      "Does not support WHERE",
    ],

    example: `TRUNCATE TABLE students;`,

    real: "Used to clear test or temporary data quickly.",

    warning: "Cannot be rolled back in most cases.",
  },

  // ================= DML =================
  // ================= DML =================

  // ================= DML =================

  insert: {
    title: "INSERT",
    description: "INSERT is used to add new records (rows) into a table.",

    syntax: `INSERT INTO table_name (column1, column2)
VALUES (value1, value2);`,

    points: [
      "Adds new rows to table",
      "Column order must match values",
      "Can insert multiple rows at once",
    ],

    example: `INSERT INTO students (name, age)
VALUES ('Anuj', 21);`,

    real: "Used when registering users, adding products, or storing any new data.",

    warning: "Missing columns or wrong order can cause errors.",
  },

  select: {
    title: "SELECT",
    description: "SELECT is used to retrieve data from one or more tables.",

    syntax: `SELECT column_name
FROM table_name
WHERE condition;`,

    points: [
      "Fetches data from database",
      "Supports WHERE, ORDER BY, GROUP BY",
      "Can be used with JOINs",
    ],

    example: `SELECT name, age FROM students WHERE age > 20;`,

    real: "Used to display data in applications like user profiles, dashboards, etc.",

    warning: "Avoid using SELECT * in large tables as it affects performance.",
  },

  update: {
    title: "UPDATE",
    description: "UPDATE is used to modify existing records in a table.",

    syntax: `UPDATE table_name
SET column = value
WHERE condition;`,

    points: [
      "Modifies existing data",
      "WHERE clause is very important",
      "Can update multiple rows",
    ],

    example: `UPDATE students
SET age = 22
WHERE name = 'Anuj';`,

    real: "Used when users update profile info or admin edits data.",

    warning: "Without WHERE, it will update ALL rows (very dangerous).",
  },

  delete: {
    title: "DELETE",
    description: "DELETE is used to remove specific rows from a table.",

    syntax: `DELETE FROM table_name
WHERE condition;`,

    points: [
      "Deletes selected rows",
      "Supports WHERE condition",
      "Can be rolled back (in transactions)",
    ],

    example: `DELETE FROM students
WHERE id = 1;`,

    real: "Used when removing users, products, or unwanted records.",

    warning: "DELETE without WHERE removes ALL data from table.",
  },
  // ================= CONSTRAINTS =================

  primary_key: {
    title: "PRIMARY KEY",
    description: "PRIMARY KEY uniquely identifies each record in a table.",

    syntax: `id INT PRIMARY KEY`,

    points: [
      "Must be unique",
      "Cannot be NULL",
      "Only one primary key per table",
    ],

    example: `CREATE TABLE students (
  id INT PRIMARY KEY,
  name VARCHAR(50)
);`,

    real: "Used to uniquely identify records like user ID, product ID, etc.",

    warning: "Duplicate or NULL values are not allowed.",
  },

  foreign_key: {
    title: "FOREIGN KEY",
    description:
      "FOREIGN KEY is used to create a relationship between two tables.",

    syntax: `FOREIGN KEY (column_name) REFERENCES parent_table(column_name)`,

    points: [
      "Maintains referential integrity",
      "Ensures valid data across tables",
      "Prevents invalid references",
    ],

    example: `CREATE TABLE enrollments (
  student_id INT,
  FOREIGN KEY (student_id) REFERENCES students(id)
);`,

    real: "Used in systems like student-course mapping, orders-users relationship.",

    warning: "Cannot insert values that do not exist in the parent table.",
  },

  not_null: {
    title: "NOT NULL",
    description: "NOT NULL ensures that a column must always have a value.",

    syntax: `column_name datatype NOT NULL`,

    points: [
      "Prevents empty values",
      "Ensures required data is always present",
    ],

    example: `name VARCHAR(50) NOT NULL`,

    real: "Used for required fields like username, email, etc.",

    warning: "If not used, NULL values may cause data inconsistency.",
  },

  unique_const: {
    title: "UNIQUE",
    description:
      "UNIQUE constraint ensures that all values in a column are different.",

    syntax: `column_name datatype UNIQUE`,

    points: ["Prevents duplicate values", "Can be applied to multiple columns"],

    example: `email VARCHAR(100) UNIQUE`,

    real: "Used for fields like email, phone number where duplicates are not allowed.",

    warning: "Unlike PRIMARY KEY, UNIQUE can allow NULL values (DB dependent).",
  },

  check_const: {
    title: "CHECK",
    description: "CHECK constraint restricts values based on a condition.",

    syntax: `CHECK (condition)`,

    points: ["Adds validation rule", "Ensures only valid data is inserted"],

    example: `CHECK (age >= 18)`,

    real: "Used to enforce rules like minimum age, salary limits, etc.",

    warning: "If condition fails, data will not be inserted.",
  },

  default_const: {
    title: "DEFAULT",
    description:
      "DEFAULT assigns a value automatically if no value is provided.",

    syntax: `column_name datatype DEFAULT value`,

    points: ["Provides fallback value", "Avoids NULL entries"],

    example: `status VARCHAR(20) DEFAULT 'active'`,

    real: "Used in systems to assign default roles, statuses, timestamps.",

    warning: "Default value must match datatype.",
  },

  // ================= JOINS =================
  // ================= JOINS =================

  inner_join: {
    title: "INNER JOIN",
    description:
      "INNER JOIN returns only the rows that have matching values in both tables.",

    syntax: `SELECT * FROM table1
INNER JOIN table2
ON table1.id = table2.id;`,

    points: [
      "Returns only matching records",
      "Most commonly used join",
      "Excludes unmatched rows",
    ],

    example: `SELECT students.name, courses.title
FROM students
INNER JOIN enrollments ON students.id = enrollments.student_id
INNER JOIN courses ON courses.id = enrollments.course_id;`,

    real: "Used when we need only related data like students who are enrolled in courses.",

    warning: "Rows without matches will not appear in result.",
  },

  left_join: {
    title: "LEFT JOIN",
    description:
      "LEFT JOIN returns all rows from left table and matching rows from right table.",

    syntax: `SELECT * FROM table1
LEFT JOIN table2
ON table1.id = table2.id;`,

    points: [
      "All rows from left table are included",
      "Unmatched rows show NULL values",
      "Useful for optional relationships",
    ],

    example: `SELECT students.name, courses.title
FROM students
LEFT JOIN enrollments ON students.id = enrollments.student_id
LEFT JOIN courses ON courses.id = enrollments.course_id;`,

    real: "Used to show all users even if they haven’t performed any action.",

    warning: "NULL values may appear for unmatched data.",
  },

  right_join: {
    title: "RIGHT JOIN",
    description:
      "RIGHT JOIN returns all rows from right table and matching rows from left table.",

    syntax: `SELECT * FROM table1
RIGHT JOIN table2
ON table1.id = table2.id;`,

    points: [
      "All rows from right table are included",
      "Opposite of LEFT JOIN",
      "Less commonly used",
    ],

    example: `SELECT students.name, courses.title
FROM students
RIGHT JOIN enrollments ON students.id = enrollments.student_id;`,

    real: "Used when right table is more important than left table.",

    warning:
      "Can be confusing, often replaced with LEFT JOIN by swapping tables.",
  },

  full_join: {
    title: "FULL OUTER JOIN",
    description:
      "FULL JOIN returns all rows from both tables, matching where possible.",

    syntax: `SELECT * FROM table1
FULL OUTER JOIN table2
ON table1.id = table2.id;`,

    points: [
      "Includes all records from both tables",
      "Unmatched rows get NULL values",
      "Combination of LEFT and RIGHT JOIN",
    ],

    example: `SELECT * FROM students
FULL OUTER JOIN enrollments
ON students.id = enrollments.student_id;`,

    real: "Used when we need complete data from both tables.",

    warning: "Not directly supported in MySQL (use UNION instead).",
  },

  cross_join: {
    title: "CROSS JOIN",
    description:
      "CROSS JOIN returns all possible combinations of rows from both tables.",

    syntax: `SELECT * FROM table1
CROSS JOIN table2;`,

    points: [
      "Creates Cartesian product",
      "Number of rows = rows1 × rows2",
      "Can generate huge data",
    ],

    example: `SELECT * FROM students CROSS JOIN courses;`,

    real: "Used for generating combinations like product variants.",

    warning: "Can create very large datasets unintentionally.",
  },

  self_join: {
    title: "SELF JOIN",
    description: "SELF JOIN is used to join a table with itself.",

    syntax: `SELECT a.column, b.column
FROM table a, table b
WHERE a.id = b.id;`,

    points: [
      "Same table used twice",
      "Uses aliases to differentiate",
      "Useful for hierarchical data",
    ],

    example: `SELECT e1.name, e2.name AS manager
FROM employees e1
JOIN employees e2
ON e1.manager_id = e2.id;`,

    real: "Used in employee-manager relationships or hierarchical structures.",

    warning: "Confusing without proper aliases.",
  },

  // ================= INDEX / VIEW / CURSOR =================

  create_index: {
    title: "CREATE INDEX",
    description:
      "INDEX is used to improve the speed of data retrieval operations on a table.",

    syntax: `CREATE INDEX index_name
ON table_name(column_name);`,

    points: [
      "Speeds up SELECT queries",
      "Works like a lookup table",
      "Consumes extra storage",
    ],

    example: `CREATE INDEX idx_name
ON students(name);`,

    real: "Used in large databases like e-commerce apps to quickly search users or products.",

    warning: "Too many indexes can slow down INSERT and UPDATE operations.",
  },

  drop_index: {
    title: "DROP INDEX",
    description: "DROP INDEX is used to remove an existing index from a table.",

    syntax: `DROP INDEX index_name ON table_name;`,

    points: [
      "Removes index structure",
      "Frees storage space",
      "Affects query performance",
    ],

    example: `DROP INDEX idx_name ON students;`,

    real: "Used when index is no longer needed or affecting performance.",

    warning: "Removing index may slow down search queries.",
  },

  create_view: {
    title: "CREATE VIEW",
    description:
      "VIEW is a virtual table based on a SQL query. It does not store data physically.",

    syntax: `CREATE VIEW view_name AS
SELECT column_name FROM table_name;`,

    points: [
      "Stores query, not actual data",
      "Simplifies complex queries",
      "Improves security by hiding columns",
    ],

    example: `CREATE VIEW student_view AS
SELECT name, age FROM students;`,

    real: "Used in dashboards to show filtered data without exposing full tables.",

    warning: "Changes in base table reflect automatically in view.",
  },

  drop_view: {
    title: "DROP VIEW",
    description: "DROP VIEW removes an existing view from the database.",

    syntax: `DROP VIEW view_name;`,

    points: ["Deletes virtual table", "Does not affect original table"],

    example: `DROP VIEW student_view;`,

    real: "Used when a view is no longer required.",

    warning: "View deletion does not delete actual data.",
  },

  cursor_demo: {
    title: "CURSOR",
    description:
      "CURSOR is used to process rows one by one instead of handling entire result set at once.",

    syntax: `DECLARE cursor_name CURSOR FOR
SELECT column FROM table;`,

    points: [
      "Processes data row by row",
      "Used in stored procedures",
      "Slower than normal queries",
    ],

    example: `DECLARE student_cursor CURSOR FOR
SELECT name FROM students;`,

    real: "Used in payroll systems, banking systems for row-by-row processing.",

    warning: "Avoid using cursor for large datasets due to performance issues.",
  },

  // ================= SET OPERATORS =================
  // ================= SET OPERATORS =================

  op_any: {
    title: "ANY",
    description:
      "ANY operator returns true if the condition is true for at least one value in the subquery.",

    syntax: `SELECT * FROM table
WHERE column > ANY (subquery);`,

    points: [
      "Compares value with multiple values",
      "Returns true if at least one condition matches",
      "Works with subqueries",
    ],

    example: `SELECT name FROM students
WHERE age > ANY (SELECT age FROM students WHERE age < 22);`,

    real: "Used when comparing a value against multiple records like finding higher salaries than at least one employee.",

    warning: "Confusing with ALL, understand difference clearly.",
  },

  op_all: {
    title: "ALL",
    description:
      "ALL operator returns true only if the condition is true for all values in the subquery.",

    syntax: `SELECT * FROM table
WHERE column > ALL (subquery);`,

    points: [
      "Condition must satisfy all values",
      "Stronger condition than ANY",
      "Used for strict filtering",
    ],

    example: `SELECT name FROM students
WHERE age > ALL (SELECT age FROM students WHERE age < 22);`,

    real: "Used when finding values greater than every other value in a group.",

    warning: "If even one value fails, condition becomes false.",
  },

  op_in: {
    title: "IN",
    description:
      "IN operator checks if a value matches any value in a list or subquery.",

    syntax: `SELECT * FROM table
WHERE column IN (value1, value2);`,

    points: [
      "Simplifies multiple OR conditions",
      "Works with lists or subqueries",
      "Easy to use and readable",
    ],

    example: `SELECT * FROM students
WHERE id IN (1, 2, 3);`,

    real: "Used when selecting multiple known values like specific user IDs.",

    warning: "Large IN lists can impact performance.",
  },

  op_exists: {
    title: "EXISTS",
    description: "EXISTS checks whether a subquery returns any rows.",

    syntax: `SELECT * FROM table
WHERE EXISTS (subquery);`,

    points: [
      "Returns true if subquery has data",
      "Stops execution after first match",
      "Efficient for large datasets",
    ],

    example: `SELECT name FROM students s
WHERE EXISTS (
  SELECT 1 FROM enrollments e
  WHERE s.id = e.student_id
);`,

    real: "Used to check existence of related data like users having orders.",

    warning: "EXISTS is often faster than IN for large datasets.",
  },

  op_union: {
    title: "UNION",
    description:
      "UNION combines results of two or more SELECT queries into a single result.",

    syntax: `SELECT column FROM table1
UNION
SELECT column FROM table2;`,

    points: [
      "Combines multiple result sets",
      "Removes duplicate rows",
      "Columns must be same in number and type",
    ],

    example: `SELECT name FROM students
UNION
SELECT title FROM courses;`,

    real: "Used to merge data from different tables like combining users from multiple sources.",

    warning: "Use UNION ALL if you don’t want to remove duplicates (faster).",
  },

  // ================= TRIGGERS =================
  // ================= TRIGGERS =================

  trigger_insert: {
    title: "TRIGGER (INSERT)",
    description:
      "INSERT trigger automatically executes when a new record is inserted into a table.",

    syntax: `CREATE TRIGGER trigger_name
AFTER INSERT ON table_name
FOR EACH ROW
BEGIN
  -- SQL statements
END;`,

    points: [
      "Executes automatically after insert",
      "Uses NEW keyword to access inserted values",
      "Used for logging and automation",
    ],

    example: `CREATE TRIGGER after_student_insert
AFTER INSERT ON students
FOR EACH ROW
INSERT INTO student_log (student_name, action)
VALUES (NEW.name, 'INSERT');`,

    real: "Used in systems to log new user registrations or transactions automatically.",

    warning: "Too many triggers can slow down database performance.",
  },

  trigger_update: {
    title: "TRIGGER (UPDATE)",
    description:
      "UPDATE trigger executes automatically when a record is updated.",

    syntax: `CREATE TRIGGER trigger_name
AFTER UPDATE ON table_name
FOR EACH ROW
BEGIN
  -- SQL statements
END;`,

    points: [
      "Executes after update",
      "Uses OLD and NEW values",
      "Useful for tracking changes",
    ],

    example: `CREATE TRIGGER after_student_update
AFTER UPDATE ON students
FOR EACH ROW
INSERT INTO student_log (student_name, action)
VALUES (NEW.name, 'UPDATED');`,

    real: "Used to track changes like salary updates or profile edits.",

    warning: "Incorrect logic can cause infinite loops in triggers.",
  },

  trigger_delete: {
    title: "TRIGGER (DELETE)",
    description:
      "DELETE trigger executes automatically when a record is deleted.",

    syntax: `CREATE TRIGGER trigger_name
AFTER DELETE ON table_name
FOR EACH ROW
BEGIN
  -- SQL statements
END;`,

    points: [
      "Executes after deletion",
      "Uses OLD keyword",
      "Used for audit logging",
    ],

    example: `CREATE TRIGGER after_student_delete
AFTER DELETE ON students
FOR EACH ROW
INSERT INTO student_log (student_name, action)
VALUES (OLD.name, 'DELETED');`,

    real: "Used in systems to track deleted records or maintain logs.",

    warning: "Deleted data cannot be recovered unless logged properly.",
  },
};

function loadTheory(cmd) {
  const data = THEORY_DATA[cmd];
  const theoryBody = $("theoryBody");

  if (!data) {
    theoryBody.innerHTML = `<p>No theory available</p>`;
    return;
  }

  theoryBody.innerHTML = `
  <div class="theory-content fade-in">

    <div class="theory-command-name">${data.title}</div>

    <div class="theory-description">
      ${data.description}
    </div>

    <div class="theory-section">
      <div class="theory-section-title">Syntax</div>
      <pre class="syntax-block">${data.syntax}</pre>
    </div>

    <div class="theory-section">
      <div class="theory-section-title">Key Points</div>
      <ul class="theory-key-points">
        ${data.points.map((p) => `<li>${p}</li>`).join("")}
      </ul>
    </div>

    ${
      data.example
        ? `
    <div class="theory-section">
      <div class="theory-section-title">Example</div>
      <pre class="syntax-block">${data.example}</pre>
    </div>`
        : ""
    }

    ${
      data.real
        ? `
    <div class="theory-section">
      <div class="theory-section-title">Real Life Use</div>
      <p>${data.real}</p>
    </div>`
        : ""
    }

    ${
      data.warning
        ? `
    <div class="theory-note">
      ${data.warning}
    </div>`
        : ""
    }

  </div>
`;
}

async function executeQuery() {
  const query = $("sqlEditor").value.trim();

  if (!query) {
    showToast("Enter a SQL query first", "error");
    return;
  }

  const resultsBody = $("resultsBody");
  const resultsMeta = $("resultsMeta");
  const runBtn = $("btnRun");

  runBtn.disabled = true;

  resultsBody.innerHTML = `
    <div class="result-message info fade-in">
      Running query...
    </div>
  `;
  resultsMeta.textContent = "Executing...";

  try {
    const res = await fetch("http://localhost:5000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();

    let html = "";

    if (data.success) {
      if (Array.isArray(data.rows)) {
        if (data.rows.length === 0) {
          html += `
            <div class="result-message info fade-in">
              ⚠️ No data found
            </div>
          `;
        } else {
          html += buildTableHTML(Object.keys(data.rows[0]), data.rows);
        }

        resultsMeta.textContent = `${data.rows.length} rows · ${data.executionTime}`;
      } else {
        html += `
          <div class="result-message success fade-in">
            ✅ ${data.message}
            <br><small>Affected Rows: ${data.affectedRows}</small>
          </div>
        `;
        resultsMeta.textContent = `Success · ${data.executionTime}`;
      }

      if (data.explanation) {
        html += `
          <div class="what-you-did-card">
            <h5> What you did</h5>
            <p>${data.explanation}</p>
          </div>
        `;
      }

      if (!html) {
        html = `<div class="result-message info">No response</div>`;
      }

      const logsRes = await fetch("http://localhost:5000/logs");
      const logsData = await logsRes.json();

      let historyHTML = "";

      if (logsData.success && logsData.logs.length > 0) {
        historyHTML += `<div class="query-history">
    <h4>🕒 Query History</h4>`;

        logsData.logs
          .slice(-5)
          .reverse()
          .forEach((log) => {
            historyHTML += `
  <div class="history-item">
    <span class="time">${log.time}</span>
    <span class="query" onclick="document.getElementById('sqlEditor').value = \`${log.query}\`">
  ${log.query}
</span>
  </div>
`;
          });

        historyHTML += `</div>`;
      }

      // ✅ FINAL RENDER
      resultsBody.innerHTML = html + historyHTML;

      showToast("Query executed", "success");
      loadTables();
    } else {
      resultsBody.innerHTML = `
        <div class="result-message error fade-in">
          ❌ ${data.error}
        </div>
      `;
      resultsMeta.textContent = "Error";

      showToast("Query failed", "error");
    }
  } catch (err) {
    console.error(err);

    resultsBody.innerHTML = `
      <div class="result-message error fade-in">
        ❌ ${err.message}
      </div>
    `;
    resultsMeta.textContent = "Connection Error";

    showToast("Server error", "error");
  } finally {
    runBtn.disabled = false;
  }
}

function buildTableHTML(headers, rows) {
  let html = "<table class='data-table'><thead><tr>";

  headers.forEach((h) => {
    html += `<th>${h}</th>`;
  });

  html += "</tr></thead><tbody>";

  rows.forEach((row) => {
    html += "<tr>";
    headers.forEach((h) => {
      html += `<td>${row[h]}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  return html;
}

// ================= CONNECT UI =================

// Run button click
$("btnRun").addEventListener("click", executeQuery);

$("btnRun").addEventListener("click", executeQuery);

$("btnClear").addEventListener("click", () => {
  $("sqlEditor").value = "";

  // trigger line number update
  $("sqlEditor").dispatchEvent(new Event("input"));

  $("resultsBody").innerHTML = `
    <div class="results-placeholder">
      <p>Select a command or write a query to see results here</p>
    </div>
  `;

  $("resultsMeta").textContent = "";
});


$("sqlEditor").addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") {
    executeQuery();
  }
});
// ================= SIDEBAR CLICK CONNECTION =================

document.querySelectorAll(".cmd-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const cmd = btn.dataset.cmd;

    loadTheory(cmd);

    if (THEORY_DATA[cmd]) {
      $("sqlEditor").value = THEORY_DATA[cmd].syntax;
      $("sqlEditor").dispatchEvent(new Event("input")); //  triggers line update
    }

    // highlight active button
    document
      .querySelectorAll(".cmd-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

async function loadTables() {
  try {
    const res = await fetch("http://localhost:5000/tables");
    const data = await res.json();

    if (!data.success) {
      console.error("Tables API error:", data.error);

      const container = document.getElementById("currentTableDisplay");
      container.innerHTML = `
    <div class="result-message error">
      ❌ Failed to load tables: ${data.error}
    </div>
  `;
      return;
    }

    TABLE_CACHE = data.data;

    if (!TABLE_CACHE || Object.keys(TABLE_CACHE).length === 0) {
      const container = document.getElementById("currentTableDisplay");
      container.innerHTML = `
    <div class="result-message info">
      ⚠️ No tables available
    </div>
  `;
      return;
    }

    const activeTabElement = document.querySelector(".table-tab.active");

    const activeTab =
      activeTabElement?.dataset.table || Object.keys(TABLE_CACHE)[0];

    renderTable(TABLE_CACHE[activeTab]);
  } catch (err) {
    console.error("Tables error:", err);

    const container = document.getElementById("currentTableDisplay");
    container.innerHTML = `
    <div class ="result-message error">
      ❌ Cannot connect to server
    </div>
  `;
  }
}

function renderTable(rows) {
  console.log("Rendering table:", rows);

  const container = document.getElementById("currentTableDisplay");
  container.innerHTML = "Loading...";

  if (!rows || rows.length === 0) {
    container.innerHTML = "<p>No data</p>";
    return;
  }

  const headers = Object.keys(rows[0]);

  let html = "<table class='data-table'><thead><tr>";

  headers.forEach((h) => {
    html += `<th>${h}</th>`;
  });

  html += "</tr></thead><tbody>";

  rows.forEach((row) => {
    html += "<tr>";
    headers.forEach((h) => {
      html += `<td>${row[h]}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";

  container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  loadTables();
  loadTheory("select");
  checkServerStatus();
  setInterval(checkServerStatus, 5000);

  const editor = $("sqlEditor");
  const lineNumbers = $("lineNumbers");

  function updateLineNumbers() {
    const lines = editor.value.split("\n").length;

    let numbers = "";
    for (let i = 1; i <= lines; i++) {
      numbers += i + "<br>";
    }

    lineNumbers.innerHTML = numbers;
  }

  editor.addEventListener("input", updateLineNumbers);
  updateLineNumbers();
});

// ================= TABLE TAB SWITCHING =================
document.querySelectorAll(".table-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const table = tab.dataset.table;

    if (TABLE_CACHE[table]) {
      renderTable(TABLE_CACHE[table]);
    }

    document
      .querySelectorAll(".table-tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
  });
});

// ================= RESET BUTTON =================
$("btnResetAll").addEventListener("click", async () => {
  try {
    await fetch("http://localhost:5000/reset", {
      method: "POST",
    });

    showToast("Database reset", "success");
    loadTables();
  } catch {
    showToast("Reset failed", "error");
  }
});

// ================= CATEGORY DROPDOWN =================
document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".category-btn").forEach((b) => {
      b.classList.remove("active");
    });

    this.classList.add("active");

    document
      .querySelectorAll(".command-list")
      .forEach((l) => l.classList.remove("open"));

    const list = this.parentElement.querySelector(".command-list");

    if (list.classList.contains("open")) {
      list.classList.remove("open");
    } else {
      list.classList.add("open");
    }
  });
});

async function checkServerStatus() {
  const statusText = document.getElementById("statusText");
  const statusDot = document.getElementById("statusDot");

  try {
    const res = await fetch("http://localhost:5000/test");

    if (res.ok) {
      statusText.textContent = "Database Connected";
      statusDot.style.background = "green";
    } else {
      throw new Error();
    }
  } catch (err) {
    statusText.textContent = "Disconnected";
    statusDot.style.background = "red";
  }
}


const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const db = require("../connection");

/* ================= DATE HELPERS ================= */

function toDBDate(input) {
  if (!input) return null;
  if (typeof input === "string" && input.length === 10) return input;
  return new Date(input).toISOString().split("T")[0];
}

function toDateObj(input) {
  const d = new Date(input);
  d.setHours(0, 0, 0, 0);
  return d;
}


router.get("/api/project/pro_details/:employeeId", (req, res) => {
  const { employeeId } = req.params;

  const sql = `
    SELECT p.Project_Id, p.Project_Name
    FROM project p
    JOIN project_allaction pa ON p.Project_Id = pa.Project_Id
    WHERE pa.Employee_Id = ?
  `;

  db.query(sql, [employeeId], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (!rows.length) return res.status(404).json({ message: "No project found" });
    res.json(rows);
  });
});


// router.post("/api/project/timesheetsubmit", (req, res) => {
//   const {
//     Employee_Id, Project_Id,
//     Timesheet_Start_Date, Timesheet_End_Date,
//     Day1_Hrs, Day2_Hrs, Day3_Hrs,
//     Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs
//   } = req.body;

//   if (!Employee_Id || !Project_Id || !Timesheet_Start_Date || !Timesheet_End_Date) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   const input = [
//     Day1_Hrs, Day2_Hrs, Day3_Hrs,
//     Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs
//   ];

//   // 🔐 GUARD 1: Check any worked hours entered
//   const hasWorkedHours = input.some(h => Number(h) > 0);

//   if (!hasWorkedHours) {
//     return res.json({
//       message: "No worked hours. Timesheet not created."
//     });
//   }

//   const checkSql = `
//     SELECT 1 FROM timesheet
//     WHERE Employee_Id = ? AND Project_Id = ?
//       AND Timesheet_Start_Date = ? AND Timesheet_End_Date = ?
//   `;

//   db.query(
//     checkSql,
//     [Employee_Id, Project_Id, Timesheet_Start_Date, Timesheet_End_Date],
//     (err, rows) => {
//       if (err) return res.status(500).json(err);
//       if (rows.length) {
//         return res.status(400).json({ error: "Timesheet already submitted" });
//       }

//       const holidaySql = `
//         SELECT Event_Date FROM calendar
//         WHERE Event_Type = 'holiday'
//         AND Event_Date BETWEEN ? AND DATE_ADD(?, INTERVAL 6 DAY)
//       `;

//       db.query(
//         holidaySql,
//         [Timesheet_Start_Date, Timesheet_Start_Date],
//         (err, holidays) => {
//           if (err) return res.status(500).json(err);

//           // const holidayDates = holidays.map(h =>
//           //   formatDateLocal(normalizeDate(h.Event_Date))
//           // );

//           // const processed = input.map((val, i) => {
//           //   const d = normalizeDate(Timesheet_Start_Date);
//           //   d.setDate(d.getDate() + i);
//           //   return holidayDates.includes(formatDateLocal(d))
//           //     ? "Holiday"
//           //     : Number(val || 0);
//           // });

//           const holidayDates = holidays.map(h =>
//             formatDateLocal(normalizeDate(h.Event_Date))
//           );

//           const startDateObj = normalizeDate(Timesheet_Start_Date);

//           const processed = input.map((val, i) => {
//             const d = new Date(startDateObj); // clone
//             d.setDate(d.getDate() + i);

//             return holidayDates.includes(formatDateLocal(d))
//               ? "Holiday"
//               : Number(val || 0);
//           });


//           const Total_Hrs = processed
//             .filter(x => x !== "Holiday")
//             .reduce((sum, h) => sum + h, 0);

//           const insertSql = `
//             INSERT INTO timesheet (
//               Timesheet_Id, Employee_Id, Project_Id,
//               Timesheet_Start_Date, Timesheet_End_Date,
//               Day1_Hrs, Day2_Hrs, Day3_Hrs,
//               Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs,
//               Total_Hrs, Timesheet_Status, Timesheet_Submit_Date
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())
//           `;

//           db.query(
//             insertSql,
//             [
//               uuidv4(), Employee_Id, Project_Id,
//               Timesheet_Start_Date, Timesheet_End_Date,
//               ...processed, Total_Hrs
//             ],
//             err => {
//               if (err) return res.status(500).json(err);
//               res.json({ message: "Timesheet submitted successfully" });
//             }
//           );
//         }
//       );
//     }
//   );
// });

// router.post("/api/project/leavesubmit", (req, res) => {
//   const {
//     Employee_Id, Project_Id,
//     Leave_Start_Date, Leave_End_Date,
//     Day1_Hrs, Day2_Hrs, Day3_Hrs,
//     Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs
//   } = req.body;

//   if (!Employee_Id || !Project_Id || !Leave_Start_Date || !Leave_End_Date) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   const input = [
//     Day1_Hrs, Day2_Hrs, Day3_Hrs,
//     Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs
//   ];

//   // 🔐 GUARD 2: Check any leave hours entered
//   const hasLeaveHours = input.some(h => Number(h) > 0);

//   if (!hasLeaveHours) {
//     return res.json({
//       message: "No leave hours. Leave not created."
//     });
//   }

//   const checkSql = `
//     SELECT 1 FROM \`leave\`
//     WHERE Employee_Id = ? AND Project_Id = ?
//       AND Leave_Start_Date = ? AND Leave_End_Date = ?
//   `;

//   db.query(
//     checkSql,
//     [Employee_Id, Project_Id, Leave_Start_Date, Leave_End_Date],
//     (err, rows) => {
//       if (err) return res.status(500).json(err);
//       if (rows.length) {
//         return res.status(400).json({ error: "Leave already submitted" });
//       }

//       const holidaySql = `
//         SELECT Event_Date FROM calendar
//         WHERE Event_Type = 'holiday'
//         AND Event_Date BETWEEN ? AND DATE_ADD(?, INTERVAL 6 DAY)
//       `;

//       db.query(
//         holidaySql,
//         [Leave_Start_Date, Leave_Start_Date],
//         (err, holidays) => {
//           if (err) return res.status(500).json(err);

//           // const holidayDates = holidays.map(h =>
//           //   formatDateLocal(normalizeDate(h.Event_Date))
//           // );

//           // const processed = input.map((val, i) => {
//           //   const d = normalizeDate(Leave_Start_Date);
//           //   d.setDate(d.getDate() + i);
//           //   return holidayDates.includes(formatDateLocal(d))
//           //     ? "Holiday"
//           //     : Number(val || 0);
//           // });

//           const holidayDates = holidays.map(h =>
//             formatDateLocal(normalizeDate(h.Event_Date))
//           );

//           const startDateObj = normalizeDate(Leave_Start_Date);

//           const processed = input.map((val, i) => {
//             const d = new Date(startDateObj);
//             d.setDate(d.getDate() + i);

//             return holidayDates.includes(formatDateLocal(d))
//               ? "Holiday"
//               : Number(val || 0);
//           });



//           const Total_Hrs = processed
//             .filter(x => x !== "Holiday")
//             .reduce((sum, h) => sum + h, 0);

//           const insertSql = `
//             INSERT INTO \`leave\` (
//               Leave_Id, Employee_Id, Project_Id,
//               Leave_Start_Date, Leave_End_Date,
//               Day1_Hrs, Day2_Hrs, Day3_Hrs,
//               Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs,
//               Total_Hrs, Leave_Status, Leave_Submit_Date
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())
//           `;

//           db.query(
//             insertSql,
//             [
//               uuidv4(), Employee_Id, Project_Id,
//               Leave_Start_Date, Leave_End_Date,
//               ...processed, Total_Hrs
//             ],
//             err => {
//               if (err) return res.status(500).json(err);
//               res.json({ message: "Leave submitted successfully" });
//             }
//           );
//         }
//       );
//     }
//   );
// });

router.get("/api/project/getTimesheet/:employeeId/:projectId/:startDate",
  (req, res) => {

    const { employeeId, projectId, startDate } = req.params;

    const sql = `
    SELECT Timesheet_Id,
           Day1_Hrs, Day2_Hrs, Day3_Hrs,
           Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs
    FROM timesheet
    WHERE Employee_Id = ? AND Project_Id = ? AND Timesheet_Start_Date = ?
  `;

    db.query(sql, [employeeId, projectId, startDate], (err, rows) => {
      if (err) return res.status(500).json(err);

      if (!rows.length) {
        return res.json({
          Timesheet_Id: null,
          Day1_Hrs: "", Day2_Hrs: "", Day3_Hrs: "",
          Day4_Hrs: "", Day5_Hrs: "", Day6_Hrs: "", Day7_Hrs: ""
        });
      }

      res.json(rows[0]);
    });
  });


router.get("/api/project/getLeave/:employeeId/:projectId/:startDate",
  (req, res) => {

    const { employeeId, projectId, startDate } = req.params;

    const sql = `
    SELECT Leave_Id,
           Day1_Hrs, Day2_Hrs, Day3_Hrs,
           Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs
    FROM \`leave\`
    WHERE Employee_Id = ? AND Project_Id = ? AND Leave_Start_Date = ?
  `;

    db.query(sql, [employeeId, projectId, startDate], (err, rows) => {
      if (err) return res.status(500).json(err);

      if (!rows.length) {
        return res.json({
          Leave_Id: null,
          Day1_Hrs: "", Day2_Hrs: "", Day3_Hrs: "",
          Day4_Hrs: "", Day5_Hrs: "", Day6_Hrs: "", Day7_Hrs: ""
        });
      }

      res.json(rows[0]);
    });
  });

// router.put("/api/project/updateTimesheet/:Timesheet_Id", (req, res) => {
//   const { Timesheet_Id } = req.params;

//   const {
//     Employee_Id,
//     Project_Id,
//     Timesheet_Start_Date, // Monday
//     Timesheet_End_Date,   // Sunday
//     Day1_Hrs, Day2_Hrs, Day3_Hrs,
//     Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs
//   } = req.body;

//   if (!Timesheet_Id || !Employee_Id || !Project_Id) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   const processed = [
//     Day1_Hrs, Day2_Hrs, Day3_Hrs,
//     Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs
//   ];

//   const Total_Hrs = processed
//     .filter(x => x !== "Holiday")
//     .reduce((sum, h) => sum + Number(h || 0), 0);

//   const sql = `
//     UPDATE timesheet SET
//       Employee_Id = ?,
//       Project_Id = ?,
//       Timesheet_Start_Date = ?,
//       Timesheet_End_Date = ?,
//       Day1_Hrs = ?,
//       Day2_Hrs = ?,
//       Day3_Hrs = ?,
//       Day4_Hrs = ?,
//       Day5_Hrs = ?,
//       Day6_Hrs = ?,
//       Day7_Hrs = ?,
//       Total_Hrs = ?,
//        Timesheet_Status = 'Pending'
//     WHERE Timesheet_Id = ?
//   `;

//   db.query(
//     sql,
//     [
//       Employee_Id,
//       Project_Id,
//       Timesheet_Start_Date,
//       Timesheet_End_Date,
//       ...processed,
//       Total_Hrs,
//       Timesheet_Id
//     ],
//     (err, result) => {
//       if (err) return res.status(500).json(err);
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ error: "Timesheet not found" });
//       }
//       res.json({ message: "Timesheet updated successfully" });
//     }
//   );
// });

// router.put("/api/project/updateLeave/:Leave_Id", (req, res) => {
//   const { Leave_Id } = req.params;

//   const {
//     Employee_Id,
//     Project_Id,
//     Leave_Start_Date,  // Monday
//     Leave_End_Date,    // Sunday
//     Day1_Hrs, Day2_Hrs, Day3_Hrs,
//     Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs
//   } = req.body;

//   if (!Leave_Id || !Employee_Id || !Project_Id) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   const processed = [
//     Day1_Hrs, Day2_Hrs, Day3_Hrs,
//     Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs
//   ];

//   const Total_Hrs = processed
//     .filter(x => x !== "Holiday")
//     .reduce((sum, h) => sum + Number(h || 0), 0);

//   const sql = `
//     UPDATE \`leave\` SET
//       Employee_Id = ?,
//       Project_Id = ?,
//       Leave_Start_Date = ?,
//       Leave_End_Date = ?,
//       Day1_Hrs = ?,
//       Day2_Hrs = ?,
//       Day3_Hrs = ?,
//       Day4_Hrs = ?,
//       Day5_Hrs = ?,
//       Day6_Hrs = ?,
//       Day7_Hrs = ?,
//       Total_Hrs = ?,
//        Leave_Status = 'Pending'
//     WHERE Leave_Id = ?
//   `;

//   db.query(
//     sql,
//     [
//       Employee_Id,
//       Project_Id,
//       Leave_Start_Date,
//       Leave_End_Date,
//       ...processed,
//       Total_Hrs,
//       Leave_Id
//     ],
//     (err, result) => {
//       if (err) return res.status(500).json(err);
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ error: "Leave not found" });
//       }
//       res.json({ message: "Leave updated successfully" });
//     }
//   );
// });

router.get("/api/project/getHolidays/:startDate", (req, res) => {
  const { startDate } = req.params;

  const sql = `
    SELECT Event_Date
    FROM calendar
    WHERE Event_Type = 'holiday'
    AND Event_Date BETWEEN ? AND DATE_ADD(?, INTERVAL 6 DAY)
  `;

  db.query(sql, [startDate, startDate], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

router.get("/api/project/getEmployeeRole/:employeeId", (req, res) => {
  const { employeeId } = req.params;

  const roleQuery = "SELECT Employee_Role FROM employee WHERE Employee_Id = ?";

  db.query(roleQuery, [employeeId], (error, results) => {
    if (error) {
      console.error("Database Error:", error.message || error);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (results.length > 0) {
      res.json({ employeeRole: results[0].Employee_Role });
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  });
});

// router.get("/api/project/getEmployeeDetails/:employeeId", (req, res) => {
//   const { employeeId } = req.params;

//   if (!employeeId) {
//     return res.status(400).json({ error: "Employee ID is required" });
//   }

//     // Query to check the role of the employee
//     const roleQuery = `SELECT Employee_Role FROM employee WHERE Employee_Id = ?`;

//     db.query(roleQuery, [employeeId], (err, roleResults) => {
//         if (err) {
//             console.error("Database Error:", err.message);
//             return res.status(500).json({ error: "Database query failed" });
//         }

//         if (roleResults.length === 0) {
//             return res.status(404).json({ message: "Employee not found" });
//         }

//         const employeeRole = roleResults[0].Employee_Role; // Get the role

//         let query = `
//            SELECT 
//   e.Employee_Id,
//   e.Employee_Name,
//   p.Project_Id,
//   p.Project_Name,
//   t.Timesheet_Id,
//   t.Timesheet_Start_Date AS Start_Date,
//   t.Timesheet_End_Date AS End_Date,
//   t.Total_Hrs AS Total_Worked_Hours,
//   IFNULL(l.Total_Hrs, 0) AS Total_Leave_Hours,
//   t.Timesheet_Status
// FROM employee e
// LEFT JOIN project_allocation pa ON e.Employee_Id = pa.Employee_Id
// LEFT JOIN project p ON pa.Project_Id = p.Project_Id
// LEFT JOIN timesheet t 
//   ON pa.Employee_Id = t.Employee_Id 
//  AND pa.Project_Id = t.Project_Id
// LEFT JOIN \`leave\` l
//   ON l.Employee_Id = t.Employee_Id
//  AND l.Project_Id = t.Project_Id
//  AND l.Leave_Start_Date = t.Timesheet_Start_Date
// WHERE e.Employee_Id = ?
// `;

//         let params = [];

//         if (employeeRole === "User") {
//             // Show only the logged-in user's records
//             query += ` WHERE s.Employee_Id = ?`;
//             params.push(employeeId);
//         } else if (employeeRole === "Admin") {
//             // Show only users' records (exclude admins)
//             query += ` WHERE s.Employee_Role = 'User'`;
//         }

//         db.query(query, params, (err, results) => {
//             if (err) {
//                 console.error("Database Error:", err.message);
//                 return res.status(500).json({ error: "Database query failed" });
//             }

//             if (results.length > 0) {
//                 res.json(results);
//             } else {
//                 res.status(404).json({ message: "No employee records found" });
//             }
//         });
//     });
//   });


// router.get("/api/project/getEmployeeDetails/:employeeId", (req, res) => {
//   const { employeeId } = req.params;

//   if (!employeeId) {
//     return res.status(400).json({ error: "Employee ID is required" });
//   }

//   const query = `
//   SELECT 
//     e.Employee_Id,
//     e.Employee_Name,
//     p.Project_Id AS Project_ID,
//     p.Project_Name,
//     t.Timesheet_Id,
//     t.Timesheet_Start_Date AS Start_Date,
//     t.Timesheet_End_Date AS End_Date,
//     IFNULL(t.Total_Hrs, 0) AS Total_Worked_Hours,
//     IFNULL(l.Total_Hrs, 0) AS Total_Leave_Hours,
//     t.Timesheet_Status
//   FROM employee e
//   LEFT JOIN project_allaction pa ON e.Employee_Id = pa.Employee_Id
//   LEFT JOIN project p ON pa.Project_Id = p.Project_Id
//   LEFT JOIN timesheet t 
//     ON pa.Employee_Id = t.Employee_Id 
//    AND pa.Project_Id = t.Project_Id
//   LEFT JOIN \`leave\` l
//     ON l.Employee_Id = t.Employee_Id
//    AND l.Project_Id = t.Project_Id
//    AND l.Leave_Start_Date = t.Timesheet_Start_Date
//   WHERE e.Employee_Id = ?
// `;


//   db.query(query, [employeeId], (err, results) => {
//     if (err) {
//       console.error("SQL ERROR:", err);
//       return res.status(500).json(err);
//     }
//     res.json(results);
//   });
// });


// router.get("/api/project/getEmployeeDetails/:employeeId", (req, res) => {
//   const { employeeId } = req.params;

//   if (!employeeId) {
//     return res.status(400).json({ error: "Employee ID is required" });
//   }

//   const query = `
//   SELECT
//     Employee_Id,
//     Employee_Name,
//     Project_Id,
//     Project_Name,
//     Start_Date,
//     End_Date,
//     SUM(Total_Worked_Hours) AS Total_Worked_Hours,
//     SUM(Total_Leave_Hours) AS Total_Leave_Hours,
//     MAX(Timesheet_Status) AS Timesheet_Status
//   FROM (
//     /* ===== TIMESHEET WEEKS ===== */
//     SELECT
//       e.Employee_Id,
//       e.Employee_Name,
//       p.Project_Id,
//       p.Project_Name,
//       t.Timesheet_Start_Date AS Start_Date,
//       t.Timesheet_End_Date   AS End_Date,
//       IFNULL(t.Total_Hrs, 0) AS Total_Worked_Hours,
//       0 AS Total_Leave_Hours,
//       t.Timesheet_Status
//     FROM employee e
//     JOIN project_allaction pa ON e.Employee_Id = pa.Employee_Id
//     JOIN project p ON pa.Project_Id = p.Project_Id
//     JOIN timesheet t
//       ON t.Employee_Id = pa.Employee_Id
//      AND t.Project_Id = pa.Project_Id
//     WHERE e.Employee_Id = ?

//     UNION ALL

//     /* ===== LEAVE-ONLY WEEKS ===== */
//     SELECT
//       e.Employee_Id,
//       e.Employee_Name,
//       p.Project_Id,
//       p.Project_Name,
//       l.Leave_Start_Date AS Start_Date,
//       l.Leave_End_Date   AS End_Date,
//       0 AS Total_Worked_Hours,
//       IFNULL(l.Total_Hrs, 0) AS Total_Leave_Hours,
//       l.Leave_Status AS Timesheet_Status
//     FROM employee e
//     JOIN project_allaction pa ON e.Employee_Id = pa.Employee_Id
//     JOIN project p ON pa.Project_Id = p.Project_Id
//     JOIN \`leave\` l
//       ON l.Employee_Id = pa.Employee_Id
//      AND l.Project_Id = pa.Project_Id
//     WHERE e.Employee_Id = ?
//   ) x
//   GROUP BY
//     Employee_Id,
//     Employee_Name,
//     Project_Id,
//     Project_Name,
//     Start_Date,
//     End_Date
//   ORDER BY Start_Date DESC
//   `;

//   db.query(query, [employeeId, employeeId], (err, results) => {
//     if (err) {
//       console.error("SQL ERROR:", err);
//       return res.status(500).json({ error: err.message });
//     }
//     res.json(results);
//   });
// });

router.get("/api/project/getEmployeeDetails/:employeeId", (req, res) => {
  const { employeeId } = req.params;

  if (!employeeId) {
    return res.status(400).json({ error: "Employee ID is required" });
  }

  const query = `
  SELECT
    Employee_Id,
    Employee_Name,
    Project_Id,
    Project_Name,
    Start_Date,
    End_Date,
    SUM(Total_Worked_Hours) AS Total_Worked_Hours,
    SUM(Total_Leave_Hours) AS Total_Leave_Hours,
    MAX(Status) AS Timesheet_Status,
    MAX(Timesheet_Id) AS Timesheet_Id,
    MAX(Leave_Id) AS Leave_Id
  FROM (

    /* ================= TIMESHEET WEEKS ================= */
    SELECT
      e.Employee_Id,
      e.Employee_Name,
      p.Project_Id,
      p.Project_Name,
      t.Timesheet_Id,
      NULL AS Leave_Id,
      t.Timesheet_Start_Date AS Start_Date,
      t.Timesheet_End_Date AS End_Date,
      IFNULL(t.Total_Hrs, 0) AS Total_Worked_Hours,
      0 AS Total_Leave_Hours,
      t.Timesheet_Status AS Status
    FROM employee e
    JOIN project_allaction pa ON e.Employee_Id = pa.Employee_Id
    JOIN project p ON pa.Project_Id = p.Project_Id
    JOIN timesheet t
      ON t.Employee_Id = pa.Employee_Id
     AND t.Project_Id = pa.Project_Id
    WHERE e.Employee_Id = ?

    UNION ALL

    /* ================= LEAVE-ONLY WEEKS ================= */
    SELECT
      e.Employee_Id,
      e.Employee_Name,
      p.Project_Id,
      p.Project_Name,
      NULL AS Timesheet_Id,
      l.Leave_Id,
      l.Leave_Start_Date AS Start_Date,
      l.Leave_End_Date AS End_Date,
      0 AS Total_Worked_Hours,
      IFNULL(l.Total_Hrs, 0) AS Total_Leave_Hours,
      l.Leave_Status AS Status
    FROM employee e
    JOIN project_allaction pa ON e.Employee_Id = pa.Employee_Id
    JOIN project p ON pa.Project_Id = p.Project_Id
    JOIN \`leave\` l
      ON l.Employee_Id = pa.Employee_Id
     AND l.Project_Id = pa.Project_Id
    WHERE e.Employee_Id = ?

  ) combined
  GROUP BY
    Employee_Id,
    Employee_Name,
    Project_Id,
    Project_Name,
    Start_Date,
    End_Date
  ORDER BY Start_Date DESC
  `;

  db.query(query, [employeeId, employeeId], (err, results) => {
    if (err) {
      console.error("SQL ERROR:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});


router.put("/api/project/updateTimesheet/:Timesheet_Id", (req, res) => {
  const { Timesheet_Id } = req.params;

  const {
    Employee_Id,
    Project_Id,
    Timesheet_Start_Date, // Monday
    Timesheet_End_Date,   // Sunday
    Day1_Hrs, Day2_Hrs, Day3_Hrs,
    Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs
  } = req.body;

  if (!Timesheet_Id || !Employee_Id || !Project_Id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const processed = [
    Day1_Hrs, Day2_Hrs, Day3_Hrs,
    Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs
  ];

  const Total_Hrs = processed
    .filter(x => x !== "Holiday")
    .reduce((sum, h) => sum + Number(h || 0), 0);

  const sql = `
    UPDATE timesheet SET
      Employee_Id = ?,
      Project_Id = ?,
      Timesheet_Start_Date = ?,
      Timesheet_End_Date = ?,
      Day1_Hrs = ?,
      Day2_Hrs = ?,
      Day3_Hrs = ?,
      Day4_Hrs = ?,
      Day5_Hrs = ?,
      Day6_Hrs = ?,
      Day7_Hrs = ?,
      Total_Hrs = ?,
       Timesheet_Status = 'Pending'
    WHERE Timesheet_Id = ?
  `;

  db.query(
    sql,
    [
      Employee_Id,
      Project_Id,
      Timesheet_Start_Date,
      Timesheet_End_Date,
      ...processed,
      Total_Hrs,
      Timesheet_Id
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Timesheet not found" });
      }
      res.json({ message: "Timesheet updated successfully" });
    }
  );
});

router.put("/api/project/updateLeave/:Leave_Id", (req, res) => {
  const { Leave_Id } = req.params;

  const {
    Employee_Id,
    Project_Id,
    Leave_Start_Date,  // Monday
    Leave_End_Date,    // Sunday
    Day1_Hrs, Day2_Hrs, Day3_Hrs,
    Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs
  } = req.body;

  if (!Leave_Id || !Employee_Id || !Project_Id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const processed = [
    Day1_Hrs, Day2_Hrs, Day3_Hrs,
    Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs
  ];

  const Total_Hrs = processed
    .filter(x => x !== "Holiday")
    .reduce((sum, h) => sum + Number(h || 0), 0);

  const sql = `
    UPDATE \`leave\` SET
      Employee_Id = ?,
      Project_Id = ?,
      Leave_Start_Date = ?,
      Leave_End_Date = ?,
      Day1_Hrs = ?,
      Day2_Hrs = ?,
      Day3_Hrs = ?,
      Day4_Hrs = ?,
      Day5_Hrs = ?,
      Day6_Hrs = ?,
      Day7_Hrs = ?,
      Total_Hrs = ?,
       Leave_Status = 'Pending'
    WHERE Leave_Id = ?
  `;

  db.query(
    sql,
    [
      Employee_Id,
      Project_Id,
      Leave_Start_Date,
      Leave_End_Date,
      ...processed,
      Total_Hrs,
      Leave_Id
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Leave not found" });
      }
      res.json({ message: "Leave updated successfully" });
    }
  );
});

// using for edit button page 

router.get( "/api/project/getTimesheetByIds/:timesheetId/:leaveId",
  (req, res) => {

    const { timesheetId } = req.params;

    const sql = `
      SELECT 
        t.Timesheet_Id,
        t.Employee_Id,
        t.Project_Id,
        t.Timesheet_Start_Date,
        t.Timesheet_End_Date,
        t.Day1_Hrs, t.Day2_Hrs, t.Day3_Hrs,
        t.Day4_Hrs, t.Day5_Hrs, t.Day6_Hrs, t.Day7_Hrs,
        t.Total_Hrs,
        t.Timesheet_Status,

        l.Leave_Id,
        l.Day1_Hrs AS Leave_Day1,
        l.Day2_Hrs AS Leave_Day2,
        l.Day3_Hrs AS Leave_Day3,
        l.Day4_Hrs AS Leave_Day4,
        l.Day5_Hrs AS Leave_Day5,
        l.Day6_Hrs AS Leave_Day6,
        l.Day7_Hrs AS Leave_Day7,
        l.Total_Hrs AS Leave_Total,
        l.Leave_Status

      FROM timesheet t
      LEFT JOIN \`leave\` l
        ON t.Employee_Id = l.Employee_Id
       AND t.Project_Id = l.Project_Id
       AND l.Leave_Start_Date = t.Timesheet_Start_Date
      WHERE t.Timesheet_Id = ?
    `;

    db.query(sql, [timesheetId], (err, rows) => {
      if (err) return res.status(500).json(err);
      if (!rows.length) {
        return res.status(404).json({ message: "Timesheet not found" });
      }
      res.json(rows[0]);
    });
  }
);


// function normalizeDate(dateStr) {
//   return new Date(dateStr).toISOString().split('T')[0];
// }


// ================= ADMIN – GET ALL EMPLOYEE REPORTS  REPORT PAGE =================

// router.get("/api/project/admin/reports", (req, res) => {

//   const sql = `
//     SELECT
//       e.Employee_Id,
//       e.Employee_Name,
//       p.Project_Id,
//       p.Project_Name,
//       t.Timesheet_Id,
//       t.Timesheet_Start_Date AS Start_Date,
//       t.Timesheet_End_Date AS End_Date,
//       t.Total_Hrs AS Total_Worked_Hours,
//       t.Timesheet_Status
//     FROM employee e
//     JOIN project_allaction pa
//       ON e.Employee_Id = pa.Employee_Id
//     JOIN project p
//       ON pa.Project_Id = p.Project_Id
//     JOIN timesheet t
//       ON t.Employee_Id = pa.Employee_Id
//      AND t.Project_Id = pa.Project_Id
//     WHERE e.Employee_Role <> 'Admin'
//     ORDER BY t.Timesheet_Start_Date DESC
//   `;

//   db.query(sql, (err, rows) => {
//     if (err) {
//       console.error("ADMIN REPORT ERROR:", err);
//       return res.status(500).json(err);
//     }
//     res.json(rows);
//   });
// });


// // ================= ADMIN – APPROVE / REJECT REPORT PAGE =================

// router.put("/api/project/admin/updateWeeklyStatus", (req, res) => {

//   const {
//     employeeId,
//     projectId,
//     startDate,
//     endDate,
//     status,
//     approverEmployeeId
//   } = req.body;

//   const start = toDBDate(startDate);
// const end   = toDBDate(endDate);
//   // ✅ normalize INSIDE route
//   // const start = formatDateLocal(normalizeDate(startDate));
//   // const end = formatDateLocal(normalizeDate(endDate));

//   // 1️⃣ Validate input
//   if (
//     !employeeId ||
//     !projectId ||
//     !startDate ||
//     !endDate ||
//     !approverEmployeeId ||
//     !['Approved', 'Rejected'].includes(status)
//   ) {
//     return res.status(400).json({
//       error: "Invalid request data"
//     });
//   }

//   const supervisionDate = new Date()
//     .toISOString()
//     .slice(0, 19)
//     .replace('T', ' ');

//   // 2️⃣ Get approver & check Admin
//   const getApproverQuery = `
//     SELECT Employee_Name, Employee_Role
//     FROM employee
//     WHERE Employee_Id = ?
//   `;

//   const updateTimesheetQuery = `
//     UPDATE timesheet
//     SET
//       Timesheet_Status = ?,
//       Supervision = ?,
//       Supervision_Date = ?
//     WHERE Project_Id = ?
//       AND Timesheet_Start_Date = ?
//       AND Timesheet_End_Date = ?
//   `;

//   const updateLeaveQuery = `
//     UPDATE \`leave\`
//     SET
//       Leave_Status = ?,
//       Supervision = ?,
//       Supervision_Date = ?
//     WHERE Project_Id = ?
//       AND Leave_Start_Date = ?
//       AND Leave_End_Date = ?
//   `;

//   db.beginTransaction(err => {
//     if (err) {
//       return res.status(500).json({ error: "Transaction start failed" });
//     }

//     db.query(getApproverQuery, [approverEmployeeId], (err, approverRes) => {
//       if (err || approverRes.length === 0) {
//         return db.rollback(() =>
//           res.status(404).json({ error: "Approver not found" })
//         );
//       }

//       if (approverRes[0].Employee_Role !== 'Admin') {
//         return db.rollback(() =>
//           res.status(403).json({ error: "Only Admin can approve or reject" })
//         );
//       }

//       const approverName = approverRes[0].Employee_Name;

//       // 3️⃣ Update timesheet
//       db.query(
//         updateTimesheetQuery,
//         [
//           status,
//           approverName,
//           supervisionDate,
//           projectId,
//           start,
//           end
//         ],
//         (err, timesheetResult) => {
//           if (err) {
//             return db.rollback(() =>
//               res.status(500).json({ error: "Timesheet update failed" })
//             );
//           }

//           // 4️⃣ Update leave
//           db.query(
//             updateLeaveQuery,
//             [
//               status,
//               approverName,
//               supervisionDate,
//               projectId,
//               start,
//               end
//             ],
//             (err, leaveResult) => {
//               if (err) {
//                 return db.rollback(() =>
//                   res.status(500).json({ error: "Leave update failed" })
//                 );
//               }

//               // 5️⃣ Commit
//               db.commit(err => {
//                 if (err) {
//                   return db.rollback(() =>
//                     res.status(500).json({ error: "Commit failed" })
//                   );
//                 }

//                 res.json({
//                   message: `Status updated to ${status}`,
//                   approvedBy: approverName,
//                   supervisionDate,
//                   timesheetUpdated: timesheetResult.affectedRows,
//                   leaveUpdated: leaveResult.affectedRows
//                 });
//               });
//             }
//           );
//         }
//       );
//     });
//   });
// });

// ================= ADMIN – FILTER REPORTS. REPORT PAGE =================

router.get("/api/project/admin/filterReports/:employeeId", (req, res) => {
  const { employeeId } = req.params;

  const sql = `
      SELECT
        e.Employee_Id        AS Employee_Id,
        e.Employee_Name      AS Employee_Name,
        p.Project_Id         AS Project_Id,
        p.Project_Name       AS Project_Name,
        t.Timesheet_Start_Date AS Start_Date,
        t.Timesheet_End_Date   AS End_Date,
        IFNULL(t.Total_Hrs, 0) AS Total_Worked_Hours,
        IFNULL(l.Total_Hrs, 0) AS Total_Leave_Hours,
        t.Timesheet_Status    AS Timesheet_Status
      FROM employee e
      JOIN project_allaction pa
        ON pa.Employee_Id = e.Employee_Id
      JOIN project p
        ON p.Project_Id = pa.Project_Id
      LEFT JOIN timesheet t
        ON t.Employee_Id = e.Employee_Id
       AND t.Project_Id = p.Project_Id
      LEFT JOIN \`leave\` l
        ON l.Employee_Id = e.Employee_Id
       AND l.Project_Id = p.Project_Id
       AND l.Leave_Start_Date = t.Timesheet_Start_Date
      WHERE e.Employee_Id = ?
        AND e.Employee_Role <> 'Admin'
      ORDER BY t.Timesheet_Start_Date DESC
    `;

  db.query(sql, [employeeId], (err, rows) => {
    if (err) {
      console.error("FILTER ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(rows);
  });
}
);


/* ================= TIMESHEET SUBMIT ================= */

router.post("/api/project/timesheetsubmit", (req, res) => {
  const {
    Employee_Id,
    Project_Id,
    Timesheet_Start_Date,
    Timesheet_End_Date,
    Day1_Hrs, Day2_Hrs, Day3_Hrs,
    Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs
  } = req.body;

  if (!Employee_Id || !Project_Id || !Timesheet_Start_Date || !Timesheet_End_Date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const input = [Day1_Hrs, Day2_Hrs, Day3_Hrs, Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs];
  if (!input.some(h => Number(h) > 0)) {
    return res.json({ message: "No worked hours. Timesheet not created." });
  }

  const startDB = toDBDate(Timesheet_Start_Date);
  const endDB = toDBDate(Timesheet_End_Date);
  const startObj = toDateObj(startDB);

  const checkSql = `
    SELECT 1 FROM timesheet
    WHERE Employee_Id = ? AND Project_Id = ?
      AND Timesheet_Start_Date = ? AND Timesheet_End_Date = ?
  `;

  db.query(checkSql, [Employee_Id, Project_Id, startDB, endDB], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (rows.length) return res.status(400).json({ error: "Timesheet already submitted" });

    const holidaySql = `
      SELECT Event_Date FROM calendar
      WHERE Event_Type = 'holiday'
      AND Event_Date BETWEEN ? AND DATE_ADD(?, INTERVAL 6 DAY)
    `;

    db.query(holidaySql, [startDB, startDB], (err, holidays) => {
      if (err) return res.status(500).json(err);

      const holidayDates = holidays.map(h => toDBDate(h.Event_Date));

      const processed = input.map((val, i) => {
        const d = new Date(startObj);
        d.setDate(d.getDate() + i);
        return holidayDates.includes(toDBDate(d)) ? "Holiday" : Number(val || 0);
      });

      const Total_Hrs = processed.filter(x => x !== "Holiday").reduce((a, b) => a + b, 0);

      const insertSql = `
        INSERT INTO timesheet (
          Timesheet_Id, Employee_Id, Project_Id,
          Timesheet_Start_Date, Timesheet_End_Date,
          Day1_Hrs, Day2_Hrs, Day3_Hrs,
          Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs,
          Total_Hrs, Timesheet_Status, Timesheet_Submit_Date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())
      `;

      db.query(
        insertSql,
        [uuidv4(), Employee_Id, Project_Id, startDB, endDB, ...processed, Total_Hrs],
        err => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Timesheet submitted successfully" });
        }
      );
    });
  });
});

/* ================= LEAVE SUBMIT ================= */

router.post("/api/project/leavesubmit", (req, res) => {
  const {
    Employee_Id,
    Project_Id,
    Leave_Start_Date,
    Leave_End_Date,
    Day1_Hrs, Day2_Hrs, Day3_Hrs,
    Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs
  } = req.body;

  if (!Employee_Id || !Project_Id || !Leave_Start_Date || !Leave_End_Date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const input = [Day1_Hrs, Day2_Hrs, Day3_Hrs, Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs];
  if (!input.some(h => Number(h) > 0)) {
    return res.json({ message: "No leave hours. Leave not created." });
  }

  const startDB = toDBDate(Leave_Start_Date);
  const endDB = toDBDate(Leave_End_Date);
  const startObj = toDateObj(startDB);

  const holidaySql = `
    SELECT Event_Date FROM calendar
    WHERE Event_Type = 'holiday'
    AND Event_Date BETWEEN ? AND DATE_ADD(?, INTERVAL 6 DAY)
  `;

  db.query(holidaySql, [startDB, startDB], (err, holidays) => {
    if (err) return res.status(500).json(err);

    const holidayDates = holidays.map(h => toDBDate(h.Event_Date));

    const processed = input.map((val, i) => {
      const d = new Date(startObj);
      d.setDate(d.getDate() + i);
      return holidayDates.includes(toDBDate(d)) ? "Holiday" : Number(val || 0);
    });

    const Total_Hrs = processed.filter(x => x !== "Holiday").reduce((a, b) => a + b, 0);

    const insertSql = `
      INSERT INTO \`leave\` (
        Leave_Id, Employee_Id, Project_Id,
        Leave_Start_Date, Leave_End_Date,
        Day1_Hrs, Day2_Hrs, Day3_Hrs,
        Day4_Hrs, Day5_Hrs, Day6_Hrs, Day7_Hrs,
        Total_Hrs, Leave_Status, Leave_Submit_Date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())
    `;

    db.query(
      insertSql,
      [uuidv4(), Employee_Id, Project_Id, startDB, endDB, ...processed, Total_Hrs],
      err => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Leave submitted successfully" });
      }
    );
  });
});

/* ================= ADMIN REPORTS ================= */

router.get("/api/project/admin/reports", (req, res) => {
  const sql = `
    SELECT
      e.Employee_Id,
      e.Employee_Name,
      p.Project_Id,
      p.Project_Name,
      t.Timesheet_Start_Date AS Start_Date,
      t.Timesheet_End_Date   AS End_Date,
      IFNULL(t.Total_Hrs, 0) AS Total_Worked_Hours,
      IFNULL(l.Total_Hrs, 0) AS Total_Leave_Hours,
      t.Timesheet_Status
    FROM employee e
    JOIN project_allaction pa ON pa.Employee_Id = e.Employee_Id
    JOIN project p ON p.Project_Id = pa.Project_Id
    JOIN timesheet t
      ON t.Employee_Id = e.Employee_Id
     AND t.Project_Id = p.Project_Id
    LEFT JOIN \`leave\` l
      ON l.Employee_Id = t.Employee_Id
     AND l.Project_Id = t.Project_Id
     AND l.Leave_Start_Date = t.Timesheet_Start_Date
    WHERE e.Employee_Role <> 'Admin'
    ORDER BY t.Timesheet_Start_Date DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("ADMIN REPORT ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});



/* ================= ADMIN APPROVE / REJECT ================= */

router.put("/api/project/admin/updateWeeklyStatus", (req, res) => {
  const { projectId, startDate, endDate, status, approverEmployeeId } = req.body;

  if (!projectId || !startDate || !endDate || !approverEmployeeId ||
      !["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  const startDB = toDBDate(startDate);
  const endDB = toDBDate(endDate);

  const getApprover = `
    SELECT Employee_Name, Employee_Role
    FROM employee WHERE Employee_Id = ?
  `;

  const updateTimesheet = `
    UPDATE timesheet
    SET Timesheet_Status = ?, Supervision = ?, Supervision_Date = NOW()
    WHERE Project_Id = ? AND Timesheet_Start_Date = ? AND Timesheet_End_Date = ?
  `;

  const updateLeave = `
    UPDATE \`leave\`
    SET Leave_Status = ?, Supervision = ?, Supervision_Date = NOW()
    WHERE Project_Id = ? AND Leave_Start_Date = ? AND Leave_End_Date = ?
  `;

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: "Transaction error" });

    db.query(getApprover, [approverEmployeeId], (err, rows) => {
      if (err || !rows.length || rows[0].Employee_Role !== "Admin") {
        return db.rollback(() => res.status(403).json({ error: "Not authorized" }));
      }

      const approverName = rows[0].Employee_Name;

      db.query(updateTimesheet, [status, approverName, projectId, startDB, endDB], err => {
        if (err) return db.rollback(() => res.status(500).json(err));

        db.query(updateLeave, [status, approverName, projectId, startDB, endDB], err => {
          if (err) return db.rollback(() => res.status(500).json(err));

          db.commit(err => {
            if (err) return db.rollback(() => res.status(500).json(err));
            res.json({ message: `Status updated to ${status}` });
          });
        });
      });
    });
  });
});

module.exports = router;
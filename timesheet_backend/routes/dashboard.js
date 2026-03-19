// const express = require("express");
// const router = express.Router();
// const db = require("../connection");

// /* =====================================================
//    DASHBOARD SUMMARY (TOP CARDS)
//    ===================================================== */
// router.get("/api/dashboard/summary/:employeeId", (req, res) => {
//   const { employeeId } = req.params;

//   const sql = `
//     SELECT
//       /* ===== TOTAL WORKED HOURS ===== */
//       IFNULL((
//         SELECT SUM(Total_Hrs)
//         FROM timesheet
//         WHERE Employee_Id = ?
//       ), 0) AS total_worked_hrs,

//       /* ===== TOTAL WORKED WEEKS (timesheet + leave) ===== */
//       IFNULL((
//         SELECT COUNT(DISTINCT week_start)
//         FROM (
//           SELECT Timesheet_Start_Date AS week_start
//           FROM timesheet
//           WHERE Employee_Id = ?

//           UNION

//           SELECT Leave_Start_Date AS week_start
//           FROM \`leave\`
//           WHERE Employee_Id = ?
//         ) x
//       ), 0) AS total_worked_days,

//       /* ===== PENDING APPROVALS (timesheet + leave) ===== */
//       IFNULL((
//         SELECT COUNT(*)
//         FROM (
//           SELECT Timesheet_Id
//           FROM timesheet
//           WHERE Employee_Id = ?
//             AND Timesheet_Status = 'Pending'

//           UNION ALL

//           SELECT Leave_Id
//           FROM \`leave\`
//           WHERE Employee_Id = ?
//             AND Leave_Status = 'Pending'
//         ) y
//       ), 0) AS pending_approvals,

//       /* ===== TOTAL LEAVE HOURS ===== */
//       IFNULL((
//         SELECT SUM(Total_Hrs)
//         FROM \`leave\`
//         WHERE Employee_Id = ?
//       ), 0) AS total_leave_hrs
//   `;

//   db.query(
//     sql,
//     [
//       employeeId,
//       employeeId,
//       employeeId,
//       employeeId,
//       employeeId,
//       employeeId
//     ],
//     (err, rows) => {
//       if (err) {
//         console.error("Dashboard summary error:", err);
//         return res.status(500).json(err);
//       }
//       res.json(rows[0]);
//     }
//   );
// });

// /* =====================================================
//    PROJECT LIST (DROPDOWN)
//    ===================================================== */
// router.get("/api/dashboard/projects/:employeeId", (req, res) => {
//   const { employeeId } = req.params;

//   const sql = `
//     SELECT DISTINCT
//       p.Project_Id,
//       p.Project_Name
//     FROM project p
//     JOIN project_allaction pa ON p.Project_Id = pa.Project_Id
//     WHERE pa.Employee_Id = ?
//   `;

//   db.query(sql, [employeeId], (err, rows) => {
//     if (err) return res.status(500).json(err);
//     res.json(rows);
//   });
// });

// /* =====================================================
//    OVERALL DOUGHNUT CHART (ALL PROJECTS)
//    ===================================================== */
// router.get("/api/dashboard/overallChart/:employeeId", (req, res) => {
//   const { employeeId } = req.params;

//   const sql = `
//     SELECT
//       p.Project_Id,
//       p.Project_Name,
//       IFNULL(SUM(t.Total_Hrs),0) AS worked_hours,
//       IFNULL(SUM(l.Total_Hrs),0) AS leave_hours
//     FROM project p
//     JOIN project_allaction pa ON p.Project_Id = pa.Project_Id
//     LEFT JOIN timesheet t
//       ON t.Project_Id = p.Project_Id
//      AND t.Employee_Id = pa.Employee_Id
//     LEFT JOIN \`leave\` l
//       ON l.Project_Id = p.Project_Id
//      AND l.Employee_Id = pa.Employee_Id
//     WHERE pa.Employee_Id = ?
//     GROUP BY p.Project_Id, p.Project_Name
//   `;

//   db.query(sql, [employeeId], (err, rows) => {
//     if (err) return res.status(500).json(err);

//     res.json({
//       projects: rows.map(r => ({
//         project_name: r.Project_Name,
//         total_hours: Number(r.worked_hours) + Number(r.leave_hours)
//       }))
//     });
//   });
// });

// /* =====================================================
//    PROJECT SUMMARY (SINGLE PROJECT CHART)
//    ===================================================== */
// router.get("/api/dashboard/projectSummary/:employeeId/:projectId", (req, res) => {
//   const { employeeId, projectId } = req.params;

//   const sql = `
//     SELECT
//       IFNULL(SUM(Total_Hrs),0) AS worked_hours,
//       COUNT(DISTINCT Timesheet_Start_Date) AS worked_days,
//       SUM(CASE WHEN Timesheet_Status = 'Pending' THEN 1 ELSE 0 END)
//         AS pending_count
//     FROM timesheet
//     WHERE Employee_Id = ?
//       AND Project_Id = ?
//   `;

//   db.query(sql, [employeeId, projectId], (err, rows) => {
//     if (err) return res.status(500).json(err);
//     res.json(rows[0]);
//   });
// });

// /* =====================================================
//    WEEKLY WORKED HOURS (ALL PROJECTS)
//    ===================================================== */
// router.get("/api/dashboard/weekly/:employeeId", (req, res) => {
//   const { employeeId } = req.params;

//   const sql = `
//     SELECT
//       CONCAT('Week ', WEEK(Timesheet_Start_Date)) AS week,
//       SUM(Total_Hrs) AS hours
//     FROM timesheet
//     WHERE Employee_Id = ?
//     GROUP BY WEEK(Timesheet_Start_Date)
//     ORDER BY WEEK(Timesheet_Start_Date)
//   `;

//   db.query(sql, [employeeId], (err, rows) => {
//     if (err) return res.status(500).json(err);
//     res.json(rows);
//   });
// });

// /* =====================================================
//    WEEKLY WORKED HOURS (PROJECT-WISE)
//    ===================================================== */
// router.get("/api/dashboard/projectWeekly/:employeeId/:projectId", (req, res) => {
//   const { employeeId, projectId } = req.params;

//   const sql = `
//     SELECT
//       CONCAT('Week ', WEEK(Timesheet_Start_Date)) AS week,
//       SUM(Total_Hrs) AS hours
//     FROM timesheet
//     WHERE Employee_Id = ?
//       AND Project_Id = ?
//     GROUP BY WEEK(Timesheet_Start_Date)
//     ORDER BY WEEK(Timesheet_Start_Date)
//   `;

//   db.query(sql, [employeeId, projectId], (err, rows) => {
//     if (err) return res.status(500).json(err);
//     res.json(rows);
//   });
// });

// module.exports = router;


// // const express = require("express");
// // const router = express.Router();
// // const db = require("../connection");

// // /* =====================================================
// //    WEEK CALCULATION (MYSQL)
// //    Monday = start of week
// //    ===================================================== */
// // // WEEK START:
// // // DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)

// // /* =====================================================
// //    DASHBOARD SUMMARY (TOP 4 CARDS)
// //    ===================================================== */
// // router.get("/api/dashboard/summary/:employeeId", (req, res) => {
// //   const { employeeId } = req.params;

// //   const sql = `
// //     SELECT
// //       /* ===== TOTAL WORKED HOURS (CURRENT WEEK) ===== */
// //       IFNULL((
// //         SELECT SUM(Total_Hrs)
// //         FROM timesheet
// //         WHERE Employee_Id = ?
// //           AND Timesheet_Start_Date =
// //               DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
// //       ), 0) AS total_worked_hrs,

// //       /* ===== TOTAL WORKED WEEKS (0 OR 1) ===== */
// //       IFNULL((
// //         SELECT COUNT(*)
// //         FROM timesheet
// //         WHERE Employee_Id = ?
// //           AND Timesheet_Start_Date =
// //               DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
// //       ), 0) AS total_worked_days,

// //       /* ===== PENDING APPROVALS (TIMESHEET + LEAVE) ===== */
// //       IFNULL((
// //         SELECT COUNT(*) FROM (
// //           SELECT Timesheet_Id
// //           FROM timesheet
// //           WHERE Employee_Id = ?
// //             AND Timesheet_Status = 'Pending'
// //             AND Timesheet_Start_Date =
// //                 DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)

// //           UNION ALL

// //           SELECT Leave_Id
// //           FROM \`leave\`
// //           WHERE Employee_Id = ?
// //             AND Leave_Status = 'Pending'
// //             AND Leave_Start_Date =
// //                 DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
// //         ) x
// //       ), 0) AS pending_approvals,

// //       /* ===== TOTAL LEAVE HOURS (CURRENT WEEK) ===== */
// //       IFNULL((
// //         SELECT SUM(Total_Hrs)
// //         FROM \`leave\`
// //         WHERE Employee_Id = ?
// //           AND Leave_Start_Date =
// //               DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
// //       ), 0) AS total_leave_hrs
// //   `;

// //   db.query(
// //     sql,
// //     [employeeId, employeeId, employeeId, employeeId, employeeId],
// //     (err, rows) => {
// //       if (err) return res.status(500).json(err);
// //       res.json(rows[0]);
// //     }
// //   );
// // });

// // /* =====================================================
// //    PROJECT LIST (DROPDOWN)
// //    ===================================================== */
// // router.get("/api/dashboard/projects/:employeeId", (req, res) => {
// //   const { employeeId } = req.params;

// //   const sql = `
// //     SELECT DISTINCT
// //       p.Project_Id,
// //       p.Project_Name
// //     FROM project p
// //     JOIN project_allaction pa ON p.Project_Id = pa.Project_Id
// //     WHERE pa.Employee_Id = ?
// //   `;

// //   db.query(sql, [employeeId], (err, rows) => {
// //     if (err) return res.status(500).json(err);
// //     res.json(rows);
// //   });
// // });

// // /* =====================================================
// //    OVERALL DOUGHNUT CHART (CURRENT WEEK – ALL PROJECTS)
// //    ===================================================== */
// // router.get("/api/dashboard/overallChart/:employeeId", (req, res) => {
// //   const { employeeId } = req.params;

// //   const sql = `
// //     SELECT
// //       p.Project_Id,
// //       p.Project_Name,
// //       IFNULL(SUM(t.Total_Hrs),0) AS worked_hours,
// //       IFNULL(SUM(l.Total_Hrs),0) AS leave_hours
// //     FROM project p
// //     JOIN project_allaction pa ON p.Project_Id = pa.Project_Id
// //     LEFT JOIN timesheet t
// //       ON t.Project_Id = p.Project_Id
// //      AND t.Employee_Id = pa.Employee_Id
// //      AND t.Timesheet_Start_Date =
// //          DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
// //     LEFT JOIN \`leave\` l
// //       ON l.Project_Id = p.Project_Id
// //      AND l.Employee_Id = pa.Employee_Id
// //      AND l.Leave_Start_Date =
// //          DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
// //     WHERE pa.Employee_Id = ?
// //     GROUP BY p.Project_Id, p.Project_Name
// //   `;

// //   db.query(sql, [employeeId], (err, rows) => {
// //     if (err) return res.status(500).json(err);

// //     res.json({
// //       projects: rows
// //         .filter(r => r.worked_hours > 0 || r.leave_hours > 0)
// //         .map(r => ({
// //           project_name: r.Project_Name,
// //           total_hours:
// //             Number(r.worked_hours) + Number(r.leave_hours)
// //         }))
// //     });
// //   });
// // });

// // /* =====================================================
// //    PROJECT SUMMARY (CURRENT WEEK – SINGLE PROJECT)
// //    ===================================================== */
// // router.get(
// //   "/api/dashboard/projectSummary/:employeeId/:projectId",
// //   (req, res) => {
// //     const { employeeId, projectId } = req.params;

// //     const sql = `
// //       SELECT
// //         IFNULL(SUM(Total_Hrs),0) AS worked_hours,
// //         COUNT(*) AS worked_days,
// //         SUM(CASE WHEN Timesheet_Status='Pending' THEN 1 ELSE 0 END)
// //           AS pending_count
// //       FROM timesheet
// //       WHERE Employee_Id = ?
// //         AND Project_Id = ?
// //         AND Timesheet_Start_Date =
// //             DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
// //     `;

// //     db.query(sql, [employeeId, projectId], (err, rows) => {
// //       if (err) return res.status(500).json(err);
// //       res.json(rows[0]);
// //     });
// //   }
// // );

// // module.exports = router;


const express = require("express");
const router = express.Router();
const db = require("../connection");

/* =====================================================
   USER DASHBOARD APIS
   ===================================================== */

/* -----------------------------
   USER SUMMARY (MONTHLY)
   Cards:
   - Total Worked Hours (month)
   - Total Worked Days (month)
   - Pending Timesheets (month)
   - Total Leave Hours (overall)
-------------------------------- */
router.get("/api/user/dashboard/summary/:employeeId", (req, res) => {
  const { employeeId } = req.params;

  const sql = `
    SELECT
      IFNULL(SUM(
        CASE
          WHEN MONTH(Timesheet_Start_Date) = MONTH(CURDATE())
           AND YEAR(Timesheet_Start_Date) = YEAR(CURDATE())
          THEN Total_Hrs
        END
      ),0) AS total_worked_hrs,

      IFNULL(COUNT(DISTINCT
        CASE
          WHEN MONTH(Timesheet_Start_Date) = MONTH(CURDATE())
           AND YEAR(Timesheet_Start_Date) = YEAR(CURDATE())
          THEN DATE(Timesheet_Start_Date)
        END
      ),0) AS total_worked_days,

      IFNULL(SUM(
        CASE
          WHEN Timesheet_Status = 'Pending'
           AND MONTH(Timesheet_Start_Date) = MONTH(CURDATE())
           AND YEAR(Timesheet_Start_Date) = YEAR(CURDATE())
          THEN 1
        END
      ),0) AS pending_timesheets,

      IFNULL(
        (SELECT ROUND(SUM(Total_Hrs)/8, 2)
         FROM \`leave\`
         WHERE Employee_Id = ?),
      0) AS total_leave_days

    FROM timesheet
    WHERE Employee_Id = ?;
  `;

  db.query(sql, [employeeId, employeeId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows[0]);
  });
});

/* -----------------------------
   USER STATUS CHART (MONTHLY)
-------------------------------- */
router.get("/api/user/dashboard/statusChart/:employeeId", (req, res) => {
  const { employeeId } = req.params;

  const sql = `
    SELECT
      SUM(Timesheet_Status = 'Approved') AS approved,
      SUM(Timesheet_Status = 'Pending') AS pending,
      SUM(Timesheet_Status = 'Rejected') AS rejected
    FROM timesheet
    WHERE Employee_Id = ?
      AND MONTH(Timesheet_Start_Date) = MONTH(CURDATE())
      AND YEAR(Timesheet_Start_Date) = YEAR(CURDATE());
  `;

  db.query(sql, [employeeId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows[0]);
  });
});

/* -----------------------------
   USER PROJECT HOURS (MONTHLY)
-------------------------------- */
router.get("/api/user/dashboard/projectChart/:employeeId", (req, res) => {
  const { employeeId } = req.params;

  const sql = `
    SELECT
      p.Project_Name,
      IFNULL(SUM(t.Total_Hrs),0) AS hours
    FROM project p
    JOIN project_allaction pa ON pa.Project_Id = p.Project_Id
    LEFT JOIN timesheet t
      ON t.Project_Id = p.Project_Id
     AND t.Employee_Id = pa.Employee_Id
     AND MONTH(t.Timesheet_Start_Date) = MONTH(CURDATE())
     AND YEAR(t.Timesheet_Start_Date) = YEAR(CURDATE())
    WHERE pa.Employee_Id = ?
    GROUP BY p.Project_Name;
  `;

  db.query(sql, [employeeId], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

/* =====================================================
   ADMIN DASHBOARD APIS
   ===================================================== */

/* -----------------------------
   ADMIN SUMMARY (MONTHLY)
   Cards:
   - Approved
   - Pending
   - Rejected
-------------------------------- */
router.get("/api/admin/dashboard/summary", (req, res) => {
  const sql = `
    SELECT
      SUM(Timesheet_Status = 'Approved') AS total_approved,
      SUM(Timesheet_Status = 'Pending') AS total_pending,
      SUM(Timesheet_Status = 'Rejected') AS total_rejected
    FROM timesheet
    WHERE MONTH(Timesheet_Start_Date) = MONTH(CURDATE())
      AND YEAR(Timesheet_Start_Date) = YEAR(CURDATE());
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows[0]);
  });
});

/* -----------------------------
   ADMIN PENDING BY PROJECT
-------------------------------- */
router.get("/api/admin/dashboard/pendingByProject", (req, res) => {
  const sql = `
    SELECT
      p.Project_Name,
      COUNT(*) AS pending_count
    FROM timesheet t
    JOIN project p ON p.Project_Id = t.Project_Id
    WHERE t.Timesheet_Status = 'Pending'
      AND MONTH(t.Timesheet_Start_Date) = MONTH(CURDATE())
      AND YEAR(t.Timesheet_Start_Date) = YEAR(CURDATE())
    GROUP BY p.Project_Name;
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

module.exports = router;

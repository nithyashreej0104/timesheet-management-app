const express = require('express');
const router = express.Router();
const db = require('../connection');

/* =====================================================
   ADD EVENT */

router.post('/api/calendar/insert-event', (req, res) => {
  const { Event_Name, Event_Date, Event_Type, Event_EveryYear } = req.body;

    if (!Event_Name || !Event_Date || !Event_Type) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO calendar
    (Event_Name, Event_Date, Event_Type, Event_EveryYear)
    VALUES (?, ?, "Holiday","yes")
  `;

  db.query(
    sql,
    [Event_Name, Event_Date, Event_Type, Event_EveryYear || 0],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Insert failed' });
      }
      res.json({ message: 'Inserted', id: result.insertId });
    }
  );
});

/* =====================================================
   GET ALL EVENTS
===================================================== */
// router.get('/api/calendar/getEvents', (req, res) => {
//   const sql = `SELECT * FROM calendar ORDER BY Event_Date`;

//   db.query(sql, (err, rows) => {
//     if (err) {
//       console.error('Fetch Error:', err);
//       return res.status(500).json([]);
//     }
//     res.json({ events: rows });
//   });
// });

// calendar.routes.js
router.get('/api/calendar/events', (req, res) => {
  // Format dates as YYYY-MM-DD on the server to avoid timezone shifts
  const query = `
    SELECT
      CalendarID,
      Event_Name,
      DATE_FORMAT(Event_Date, '%Y-%m-%d') AS Event_Date,
      Event_Type,
      Event_EveryYear
    FROM calendar
    ORDER BY Event_Date
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'DB error' });
    }
    res.json({ events: results });
  });
});


/* =====================================================
   GET EVENTS BY MONTH (YYYY-MM)
===================================================== */
router.get('/api/calendar/eventsByMonth/:month', (req, res) => {
  const { month } = req.params; // format: YYYY-MM

  const sql = `
    SELECT
      CalendarID,
      Event_Name,
      DATE_FORMAT(Event_Date, '%Y-%m-%d') AS Event_Date,
      Event_Type,
      Event_EveryYear
    FROM calendar
    WHERE DATE_FORMAT(Event_Date, '%Y-%m') = ?
  `;

  db.query(sql, [month], (err, rows) => {
    if (err) {
      console.error('Month Filter Error:', err);
      return res.status(500).json([]);
    }
    res.json({ events: rows });
  });
});

/* =====================================================
   DELETE EVENT
===================================================== */
router.delete('/api/calendar/delete-event/:eventName', (req, res) => {
  const eventName = decodeURIComponent(req.params.eventName);

  const sql = `DELETE FROM calendar WHERE Event_Name = ?`;

  db.query(sql, [eventName], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Delete failed' });
    }
    res.json({ message: 'Deleted successfully' });
  });
});

/* =====================================================
   UPDATE EVENT
===================================================== */

router.patch('/api/calendar/update-event/:calendarId', (req, res) => {
  const calendarId = req.params.calendarId;
  const { Event_Name, Event_Date } = req.body;

  const sql = `
    UPDATE calendar
    SET Event_Name = ?, Event_Date = ?
    WHERE CalendarID = ?
  `;

  db.query(sql, [Event_Name, Event_Date, calendarId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Update failed' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Updated successfully' });
  });
});


/* =====================================================
   GET HOLIDAYS FOR A WEEK (YOUR ORIGINAL API STYLE)
===================================================== */
router.get('/api/calendar/holidays/:anyDate', (req, res) => {
  const { anyDate } = req.params;

  const monday = getMonday(anyDate);
  const sunday = new Date(monday.getTime() + 6 * 86400000);

  const sql = `
    SELECT Event_Date
    FROM calendar
    WHERE LOWER(Event_Type) = 'holiday'
      AND Event_Date BETWEEN ? AND ?
  `;

  db.query(
    sql,
    [formatDate(monday), formatDate(sunday)],
    (err, rows) => {
      if (err) {
        console.error('Holiday Fetch Error:', err);
        return res.status(500).json([]);
      }

      const holidays = rows.map(r =>
        formatDate(new Date(r.Event_Date))
      );

      res.json({ holidays });
    }
  );
});

/* =====================================================
   HELPERS
===================================================== */
function getMonday(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function formatDate(date) {
  return new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split('T')[0];
}

module.exports = router;

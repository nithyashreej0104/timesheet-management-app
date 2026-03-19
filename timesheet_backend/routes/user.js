// Load environment variables (required for DB + email credentials).
require("dotenv").config();

const express = require("express");
const router = express.Router();
const db = require("../connection");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");


// ----------------- Signup -----------------
router.post("/api/user/signup", async (req, res) => {
    try {
        const { Employee_Id, Employee_Name, Email, Contact_No, Password } = req.body;

        // Validate required fields
        if (!Employee_Id || !Employee_Name || !Email || !Contact_No || !Password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if Employee_Id or Email already exists
        const checkQuery = "SELECT * FROM employee WHERE Employee_Id = ? OR Email = ?";
        db.query(checkQuery, [Employee_Id, Email], async (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            if (results.length > 0)
                return res.status(409).json({ error: "Employee ID or Email already exists" });

            // Hash password
            const hashedPassword = await bcrypt.hash(Password, 10);

            // Insert new user
            const insertQuery = `
        INSERT INTO employee (Employee_Id, Employee_Role, Employee_Name, Email, Contact_No, Password, Employee_Status)
        VALUES (?, 'User', ?, ?, ?, ?, 'Active')
      `;
            db.query(
                insertQuery,
                [Employee_Id, Employee_Name, Email, Contact_No, hashedPassword],
                (err2) => {
                    if (err2) return res.status(500).json({ error: "Error saving user data" });
                    res.status(201).json({ message: "User signed up successfully" });
                }
            );
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// ----------------- Login -----------------
router.post("/api/user/login", (req, res) => {
    let { Employee_Id, Password } = req.body;

    if (!Employee_Id || !Password) {
        return res.status(400).json({ error: "Employee ID and Password are required" });
    }

    Employee_Id = Employee_Id.trim();

    const query = "SELECT * FROM employee WHERE Employee_Id = ?";
    db.query(query, [Employee_Id], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0)
            return res.status(401).json({ error: "Employee ID does not exist" });

        const user = results[0];
        const passwordMatch = await bcrypt.compare(Password, user.Password);
        if (!passwordMatch) return res.status(401).json({ error: "Incorrect password" });

        res.status(200).json({
            message: "Login successful",
            
            user: {
                Employee_Id: user.Employee_Id,
                Employee_Name: user.Employee_Name,
                Employee_Role: user.Employee_Role,
                Email: user.Email,
            },
        });
    });
});

// ----------------- Send OTP (Forgot Password) -----------------

router.post("/api/user/forgot-password", (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) return res.status(400).json({ error: "Email is required" });

    const query = `SELECT * FROM employee WHERE LOWER(Email) = ?`;
    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(404).json({ error: "Email not found" });

        const user = results[0];
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        const updateQuery = `UPDATE employee SET otp = ?, otp_expiry = ? WHERE Employee_Id = ?`;
        db.query(updateQuery, [otp, expiry, user.Employee_Id], (err2) => {
            if (err2) return res.status(500).json({ error: "Error saving OTP" });

            // Gmail transporter

            // Email credentials must come from environment variables (no hardcoding).
            const emailUser = process.env.EMAIL_USER;
            const emailPass = process.env.EMAIL_PASS;

            if (!emailUser || !emailPass) {
                return res.status(500).json({
                    error: "Email is not configured on the server (missing EMAIL_USER / EMAIL_PASS)."
                });
            }

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",   // provided by your IT
                port: 465,                  // usually 587 (TLS) or 465 (SSL)
                secure: true,              // true if port 465, false if 587
                auth: {
                    user: emailUser,
                    pass: emailPass
                }
            });

            const mailOptions = {
                from: emailUser,
                to: email,   // employee email from the DB
                subject: "Timesheet App - OTP Verification",
                text: `Your OTP is ${otp}. It is valid for 5 minutes.`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Email error:", error);
                    return res.status(500).json({ error: "Failed to send OTP email" });
                }
                res.status(200).json({ message: "OTP sent successfully" });
            });

        });
    });
});

// ----------------- Reset Password -----------------

router.post("/api/user/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const query = `SELECT otp, otp_expiry FROM employee WHERE LOWER(email)=?`;

  db.query(query, [email.toLowerCase()], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(404).json({ error: "Email not found" });

    const user = results[0];

    if (
      !user.otp ||
      user.otp.toString() !== otp.toString() ||
      new Date(user.otp_expiry) < new Date()
    ) {
      return res.status(400).json({ success: false });
    }

    res.json({ success: true });
  });
});


// ----------------- Verify OTP -----------------

router.post("/api/user/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      error: "Email, OTP, and new password are required"
    });
  }

  const query = `SELECT * FROM employee WHERE LOWER(email)=?`;

  db.query(query, [email.toLowerCase()], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(404).json({ error: "Email not found" });

    const user = results[0];

    if (
      !user.otp ||
      user.otp.toString() !== otp.toString() ||
      new Date(user.otp_expiry) < new Date()
    ) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateQuery = `
      UPDATE employee 
      SET Password=?, otp=NULL, otp_expiry=NULL 
      WHERE Employee_Id=?
    `;

    db.query(updateQuery, [hashedPassword, user.Employee_Id], () => {
      res.json({ message: "Password reset successful" });
    });
  });
});



// Get employee info by Employee_Id
router.get('/api/user/user-profile/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  console.log("employee detail :", req.params);
  const sql = `
    SELECT 
      Employee_Id,
      Employee_Name,
      Email,
      Contact_No
    FROM employee
    WHERE Employee_Id = ?
  `;

  db.query(sql, [employeeId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
console.log("employee detail :", results);
console.log("employee detail :", results.length);
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(results[0]);
  });
});

router.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.originalUrl);
  next();
});

module.exports = router;

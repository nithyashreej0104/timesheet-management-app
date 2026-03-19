const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRouter = require("./routes/user");
const projectRouter = require("./routes/project");
const calendarRouter = require("./routes/calendar");
const dashboardRoutes = require("./routes/dashboard");

const app = express(); // initialize express app

// ✅ Middlewares (IMPORTANT)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/', userRouter);   // base route
app.use('/', projectRouter);
app.use('/', calendarRouter);
app.use('/', dashboardRoutes);

module.exports = app;

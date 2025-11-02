// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import expenseRoutes from "./routes/expenseRoutes.js";
// import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// dotenv.config();

// connectDB();

// const app = express();

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.json({
//     message: "Expense Tracker API is running!",
//     version: "1.0.0",
//     endpoints: {
//       auth: "/api/auth",
//       expenses: "/api/expenses",
//     },
//   });
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/expenses", expenseRoutes);

// app.use(notFound);
// app.use(errorHandler);

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(
//     `\n Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
//   );
//   console.log(`API Base URL: http://localhost:${PORT}`);
//   console.log(` Client URL: ${process.env.CLIENT_URL}\n`);
// });

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

// ✅ CORS Configuration - MUST BE BEFORE OTHER MIDDLEWARE
const allowedOrigins = [
  "https://expense-tracker-sid-lab.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight OPTIONS requests
app.options('*', cors());

// Body parser middleware - MUST BE AFTER CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/expenses", expenseRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "Expense Tracker API is running!",
    status: "success",
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware - MUST BE LAST
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;

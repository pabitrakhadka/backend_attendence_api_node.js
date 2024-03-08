const express = require("express");
const router = express.Router();
const db = require("../conectdb.js");
const jwt = require("jsonwebtoken");

// Define a middleware function to check authentication
function authenticateToken(req, res, next) {
  // Your authentication logic here

  // For example, checking a token from the request headers
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access denied.");

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    req.user = decoded;  // Store the decoded user information in the request object
    next();
  } catch (error) {
    res.status(403).send("Invalid token.");
  }
}

// Define your routes

// Example protected route using the authenticateToken middleware
router.get("/protected-route", authenticateToken, (req, res) => {
  // Access the decoded user information from the request object
  console.log("Authenticated user:", req.user);

  // Your route logic here
  res.send("This is a protected route.");
});

module.exports = router;
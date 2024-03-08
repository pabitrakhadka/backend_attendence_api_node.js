import mysql from 'mysql2';
require('dotenv').config(); // Load environment variables from .env file

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Connecting to MySQL using pool
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }

  console.log("Connected to MySQL database");

  // Perform database operations using 'connection'
  // ...

  // Release the connection back to the pool when done
  connection.release();

  // Don't call pool.end() here; keep the pool open for future connections

  // Example: Close the server after a delay
//   setTimeout(() => {
//     console.log("Closing the server");
//     pool.end(); // You might close the pool when shutting down the server
//   }, 5000);
});

// pool.end(); // Don't call pool.end() here; it closes the pool immediately

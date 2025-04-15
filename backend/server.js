import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

import therapistsRoutes from "./routes/therapistsRoutes.js";
import clientsRoutes from "./routes/clientsRoutes.js";
import sessionsRoutes from "./routes/sessionsRoutes.js";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend communication
app.use(cors());
app.use(express.json()); // For parsing JSON request bodies

// Register Routes
app.use("/therapists", therapistsRoutes); // Use therapist routes
app.use("/clients", clientsRoutes); // This makes /clients available
app.use("/sessions", sessionsRoutes);


// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the database connection
(async () => {
    try {
        const conn = await pool.getConnection();
        console.log("✅ Connected to MySQL database");
        conn.release();
    } catch (err) {
        console.error("❌ Database connection error:", err);
    }
})();

// Default route to check server
app.get("/", (req, res) => {
    res.send("Therapist-Client Management API is running...");
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

export default pool; // Export pool to use it in other files
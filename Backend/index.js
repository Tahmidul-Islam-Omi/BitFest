const express = require('express');
const { pool } = require('./db/connection'); // Import the database pool
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

// Ensure database connection and start the server
pool.connect((err, client, release) => {
    if (err) {
        console.error('Failed to connect to the database:', err.stack);
        process.exit(1); // Exit the process if the database connection fails
    } else {
        console.log('Database connected successfully!');
        // Start the server only after the database connection is established
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
});

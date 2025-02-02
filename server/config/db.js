const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:JPMCa%40123@localhost:5432/mission_tracker'
});

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Database connected successfully');
    release();
});

// Initialize database tables
const initializeDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS missions (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_finalized BOOLEAN DEFAULT FALSE
            );

            CREATE TABLE IF NOT EXISTS targets (
                id SERIAL PRIMARY KEY,
                mission_id INTEGER REFERENCES missions(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                is_completed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Database tables initialized successfully');
    } catch (err) {
        console.error('Error initializing database tables:', err);
    }
};

initializeDatabase();

module.exports = {
    query: (text, params) => pool.query(text, params)
};
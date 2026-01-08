import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from "./config/db.js"; //db config

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL //frontend URL. Heoku Config Var
}));




//Just testing the whole stack. Routes should be on the routes folder
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM test_items');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});



//Using whatever PORT Heroku is using. 5000 for local
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
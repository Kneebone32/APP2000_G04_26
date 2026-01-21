import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

//Henter alle hytter fra test_db
router.get('/hytter', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hytter');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});


router.get('/hytter/:id', async (req, res) => {
  try {
    const {id} = req.params;

    const result = await pool.query('SELECT * FROM hytter WHERE id = $1', [id]);

    if(result.rows.length === 0){
        return res.status(404).json({ error: 'Hytte ikke funnet' });
    }

    res.json(result.rows[0]); //bugfix. Trenger bare første index
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});




export default router;
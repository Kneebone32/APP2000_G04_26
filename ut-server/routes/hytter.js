import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Henter alle hytter fra test_db
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hytte');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Henter hytte med gitt id
router.get('/:id', async (req, res) => {
  try {
    const {id} = req.params;

    const result = await pool.query('SELECT * FROM hytte WHERE hytte_id = $1', [id]);

    if(result.rows.length === 0) {
        return res.status(404).json({ error: 'Hytte ikke funnet' });
    }

    res.json(result.rows[0]); //bugfix. Trenger bare første index
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Legger til ny hytte (Skrevet av Kristoffer)
router.post('/', async (req, res) => {
  try {
    const {hytte_navn, hytte_område, hytte_beskrivelse, hytte_sengeplasser, hytte_pris} = req.body;

    const result = await pool.query(
      `INSERT INTO hytte 
        (hytte_navn, hytte_område, hytte_beskrivelse, hytte_sengeplasser, hytte_pris)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
      [hytte_navn, hytte_område, hytte_beskrivelse, hytte_sengeplasser, hytte_pris]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke legge til hytte' });
  }
});

// Oppdaterer hytte med gitt id (Skrevet av Kristoffer)
router.put('/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const {hytte_navn, hytte_område, hytte_beskrivelse, hytte_sengeplasser, hytte_pris} = req.body;

    const result = await pool.query(
      `UPDATE hytte 
       SET hytte_navn = $1, hytte_område = $2, hytte_beskrivelse = $3, hytte_sengeplasser = $4, hytte_pris = $5 
       WHERE hytte_id = $6 
       RETURNING *`,
      [hytte_navn, hytte_område, hytte_beskrivelse, hytte_sengeplasser, hytte_pris, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hytte ikke funnet' });
    }

    res.json(result.rows[0]);
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke oppdatere hytte' });
  }
});

// Sletter hytte med gitt id (Skrevet av Kristoffer)
router.delete('/:id', async (req, res) => {
  try {
    const {id} = req.params;

    const result = await pool.query('DELETE FROM hytte WHERE hytte_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hytte ikke funnet' });
    }

    res.json({ message: 'Hytte slettet', hytte: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke slette hytte' });
  }
});

export default router;
import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

//Henter alle hytter (laget av Kay)
router.get('/hytter', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hytter');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

//Henter en hytte basert på hytte_id (laget av Kay)
router.get('/hytter/:id', async (req, res) => {
  try {
    const {id} = req.params;

    const result = await pool.query('SELECT * FROM hytter WHERE hytte_id = $1', [id]);

    if(result.rows.length === 0) {
        return res.status(404).json({ error: 'Hytte ikke funnet' });
    }

    res.json(result.rows[0]); //bugfix. Trenger bare første index
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Legger til ny hytte (Laget av Kristoffer)
router.post('/hytter', async (req, res) => {
  try {
    const {navn, sengeplasser, område, betjeningsgrad, adkomst, passerfor, tilgjengelighet, flerefilter} = req.body;

    const result = await pool.query(
      'INSERT INTO hytter (navn, sengeplasser, område, betjeningsgrad, adkomst, passerfor, tilgjengelighet, flerefilter) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [navn, sengeplasser, område, betjeningsgrad, adkomst, passerfor, tilgjengelighet, flerefilter]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke legge til hytte' });
  }
});

// Sletter hytte med gitt id (Laget av Kristoffer)
router.delete('/hytter/:id', async (req, res) => {
  try {
    const {id} = req.params;

    const result = await pool.query('DELETE FROM hytter WHERE hytte_id = $1 RETURNING *', [id]);

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
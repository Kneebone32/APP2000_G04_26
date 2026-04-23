// Laget av Sander

import express from 'express';
import pool from '../config/db.js';

const router = express.Router();


// Henter alle stier til kartet
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sti_hent_kart()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});


// Legger til ny sti
router.post('/', async (req, res) => {
  try {
    const {
      fylke_nummer,
      kommune_nummer,
      punkter
    } = req.body;

    const result = await pool.query(
      `SELECT sti_opprett($1, $2, $3) AS ny_sti_id`,
      [
        fylke_nummer,
        kommune_nummer,
        punkter ? JSON.stringify(punkter) : null
      ]
    );

    const nyStiId = result.rows[0].ny_sti_id;

    res.status(201).json({
      sti_id: nyStiId,
      message: 'Sti opprettet'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke opprette sti' });
  }
});


// Sletter sti med gitt id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('SELECT sti_slett($1)', [id]);

    res.json({
      sti_id: id,
      message: 'Sti slettet'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke slette sti' });
  }
});


export default router;

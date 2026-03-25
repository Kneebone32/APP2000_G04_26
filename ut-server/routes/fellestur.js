import express from 'express';
import pool from '../config/db.js';

const router = express.Router();


// Legger til ny aktivitet
router.post('/', async (req, res) => {
  try {
    const {
      aktivitet_tittel,
      aktivitet_beskrivelse,
      bruker_id,
      aktivitet_min_deltakere,
      aktivitet_maks_deltakere,
      datoer,
      aktivitet_status,
      hytter,
      turmaal,
      stier,
      bilder
    } = req.body;

    const result = await pool.query(
      `SELECT aktivitet_opprett(
        $1,
        $2,
        $3,
        $4,
        $5,
        $6::jsonb,
        $7::aktivitet_status_enum,
        $8::jsonb,
        $9::jsonb,
        $10::jsonb,
        $11::jsonb
      ) AS ny_aktivitet_id`,
      [
        aktivitet_tittel,
        aktivitet_beskrivelse,
        bruker_id,
        aktivitet_min_deltakere,
        aktivitet_maks_deltakere,
        datoer ? JSON.stringify(datoer) : '[]',
        (aktivitet_status ?? 'utkast'),
        hytter ? JSON.stringify(hytter) : '[]',
        turmaal ? JSON.stringify(turmaal) : '[]',
        stier ? JSON.stringify(stier) : '[]',
        bilder ? JSON.stringify(bilder) : '[]'
      ]
    );

    const nyAktivitetId = result.rows[0].ny_aktivitet_id;

    res.status(201).json({
      aktivitet_id: nyAktivitetId,
      message: 'Aktivitet opprettet'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke opprette aktivitet' });
  }
});



// Henter alle aktiviteter
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM aktivitet_hent()');
    res.json(result.rows.map(row => row.aktivitet));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});


// Sletter aktivitet
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('SELECT aktivitet_slett($1)', [id]);

    res.json({
      aktivitet_id: id,
      message: 'Aktivitet slettet'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke slette aktivitet' });
  }
});

export default router;

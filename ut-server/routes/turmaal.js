import express from 'express';
import pool from '../config/db.js';

const router = express.Router();


// Henter alle turmål til kartet
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM turmaal_hent_kart()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Henter turmål til kortoversikt
router.get('/kort', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM turmaal_hent_kort()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});


// Legger til nytt turmål
router.post('/', async (req, res) => {
  try {
    const {
      turmaal_navn,
      turmaal_breddegrad,
      turmaal_lengdegrad,
      turmaal_moh,
      turmaal_beskrivelse,  
      fylke_nummer,
      kommune_nummer,
      informasjon_id,        
      bilder                
    } = req.body;


    const result = await pool.query(
      `
      SELECT public.turmaal_opprett_hel(
        $1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb
      ) AS ny_turmaal_id
      `,
      [
        fylke_nummer,
        kommune_nummer,
        turmaal_navn,
        turmaal_breddegrad,
        turmaal_lengdegrad,
        turmaal_moh ?? null,
        turmaal_beskrivelse ?? null,
        informasjon_id ?? null,
        bilder ? JSON.stringify(bilder) : '[]'
      ]
    );

    const nyTurmaalId = result.rows[0].ny_turmaal_id;

    res.status(201).json({
      turmaal_id: nyTurmaalId,
      message: 'Turmål opprettet'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke legge til turmål' });
  }
});

// Oppdaterer turmål med gitt id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      turmaal_navn,
      turmaal_breddegrad,
      turmaal_lengdegrad,
      turmaal_moh,
      turmaal_beskrivelse,
      informasjon_id,
      bilder
    } = req.body;

    // Oppdaterer turmål i databasen
    await pool.query(
      `SELECT public.turmaal_oppdater_hel(
        $1, $2, $3, $4, $5, $6, $7, $8::jsonb
      )`,
      [
        id,
        turmaal_navn,
        turmaal_breddegrad,
        turmaal_lengdegrad,
        turmaal_moh ?? null,
        turmaal_beskrivelse ?? null,
        informasjon_id ?? null,
        bilder ? JSON.stringify(bilder) : '[]'
      ]
    );

    res.json({
      turmaal_id: id,
      message: 'Turmål oppdatert'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke oppdatere turmål' });
  }
});


// Sletter turmål med gitt id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('SELECT turmaal_slett($1)', [id]);

    res.json({
      turmaal_id: id,
      message: 'Turmål slettet'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke slette turmål' });
  }
});

export default router;

// Skrevet av Kristoffer med mindre annet er spesifisert

import express from 'express';
import passport from 'passport';
import pool from '../config/db.js';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });


// Henter hytte_id-er for innlogget hytteeier
router.get('/mine', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    //TODO: funksjon i DB
    const result = await pool.query(
      'SELECT * FROM public.hytte_hent_for_eier($1)', 
      [brukerId]
    );
    res.json(result.rows.map(r => r.hytte_id)); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente hytter' });
  }
});


// Henter alle hytter til kartet
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hytte_hent_kart()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Henter hytter til kortoversikt
router.get('/kort', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hytte_hent_kort()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Henter alle favoritthytter til en bruker
router.get('/favoritter', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const result = await pool.query('SELECT hytte_id FROM favoritt_hytte WHERE bruker_id = $1', [brukerId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente favoritter' });
  }
});

// Legger til en hytte i favoritter
router.post('/favoritter/:id', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const hytteId = req.params.id;
    await pool.query('INSERT INTO favoritt_hytte (bruker_id, hytte_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [brukerId, hytteId]);
    res.status(201).json({ message: 'Favoritt lagt til' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke legge til favoritt' });
  }
});

// Fjerner en hytte fra favoritter
router.delete('/favoritter/:id', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const hytteId = req.params.id;
    await pool.query('DELETE FROM favoritt_hytte WHERE bruker_id = $1 AND hytte_id = $2', [brukerId, hytteId]);
    res.json({ message: 'Favoritt fjernet' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke fjerne favoritt' });
  }
});

// Henter anmeldelser for en hytte
router.get('/:id/anmeldelser', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT anmeldelse_hytte_hent_for_hytte($1) AS anmeldelser', [id]);
    res.json(result.rows[0].anmeldelser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente anmeldelser' });
  }
});

// Oppretter anmeldelse for en hytte
router.post('/:id/anmeldelser', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const hytteId = req.params.id;
    const { rating, anmeldelse } = req.body;
    await pool.query('SELECT anmeldelse_hytte_opprett($1, $2, $3, $4)', [brukerId, hytteId, rating, anmeldelse]);
    res.status(201).json({ message: 'Anmeldelse opprettet' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke opprette anmeldelse' });
  }
});

// Oppdaterer anmeldelse for en hytte
router.put('/:id/anmeldelser', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const hytteId = req.params.id;
    const { rating, anmeldelse } = req.body;
    await pool.query('SELECT anmeldelse_hytte_oppdater($1, $2, $3, $4)', [brukerId, hytteId, rating, anmeldelse]);
    res.json({ message: 'Anmeldelse oppdatert' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke oppdatere anmeldelse' });
  }
});

// Sletter anmeldelse for en hytte
router.delete('/:id/anmeldelser', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const hytteId = req.params.id;
    await pool.query('SELECT anmeldelse_hytte_slett($1, $2)', [brukerId, hytteId]);
    res.json({ message: 'Anmeldelse slettet' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke slette anmeldelse' });
  }
});

// Henter hytte med gitt id (detaljvisning)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT hytte_hent_detalj($1) AS hytte', [id]);

    if (!result.rows[0].hytte) {
      return res.status(404).json({ error: 'Hytte ikke funnet' });
    }

    res.json(result.rows[0].hytte);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Legger til ny hytte
router.post('/', async (req, res) => {
  try {
    const {
      hytte_navn,
      hytte_beskrivelse,
      hytte_sengeplasser,
      hytte_pris,
      fylke_nummer,
      kommune_nummer,
      hytte_breddegrad,
      hytte_lengdegrad,
      hytte_moh,
      hytte_betjeningsgrad,
      hytte_omrade,
      info_tab,
      bilder
    } = req.body;

    // Oppretter ny hytte i databasen
    const result = await pool.query(
      `SELECT hytte_opprett_hel($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::betjeningsgrad_enum, $11, $12, $13) AS ny_hytte_id`,
      [
        fylke_nummer,
        kommune_nummer,
        hytte_navn,
        hytte_omrade,
        hytte_beskrivelse,
        hytte_sengeplasser,
        hytte_pris,
        hytte_breddegrad,
        hytte_lengdegrad,
        hytte_betjeningsgrad,
        hytte_moh,
        info_tab ? JSON.stringify(info_tab) : null,
        bilder ? JSON.stringify(bilder) : null
      ]
    );

    const nyHytteId = result.rows[0].ny_hytte_id;

    res.status(201).json({
      hytte_id: nyHytteId,
      message: 'Hytte opprettet'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke legge til hytte' });
  }
});

// Oppdaterer hytte med gitt id
router.put('/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const {
      hytte_navn,
      hytte_beskrivelse,
      hytte_sengeplasser,
      hytte_pris,
      fylke_nummer,
      kommune_nummer,
      hytte_breddegrad,
      hytte_lengdegrad,
      hytte_moh,
      hytte_betjeningsgrad,
      info_tab,
      bilder
    } = req.body;

    // Oppdaterer hytte i databasen med hytte_oppdater funksjonen
    await pool.query(
      'SELECT hytte_oppdater($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::betjeningsgrad_enum, $12, $13)',
      [
        id,
        hytte_navn,
        hytte_beskrivelse,
        hytte_sengeplasser,
        hytte_pris,
        fylke_nummer,
        kommune_nummer,
        hytte_breddegrad,
        hytte_lengdegrad,
        hytte_moh,
        hytte_betjeningsgrad,
        info_tab ? JSON.stringify(info_tab) : '[]',
        bilder ? JSON.stringify(bilder) : '[]'
      ]
    );

    res.json({
      hytte_id: id,
      message: 'Hytte oppdatert'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke oppdatere hytte' });
  }
});

// Sletter hytte med gitt id 
router.delete('/:id', async (req, res) => {
  try {
    const {id} = req.params;

    // Sletter hytte med hytte_slett funksjonen
    await pool.query('SELECT hytte_slett($1)', [id]);

    res.json({
      hytte_id: id,
      message: 'Hytte slettet'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke slette hytte' });
  }
});




export default router;

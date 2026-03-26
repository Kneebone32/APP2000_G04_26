import express from 'express';
import passport from 'passport';
import pool from '../config/db.js';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });



// Hent anmeldelser for tur
router.get('/tur/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT anmeldelse_tur_hent_for_tur($1) AS anmeldelser',
      [id]
    );

    res.json(result.rows[0].anmeldelser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Feil ved henting av anmeldelser' });
  }
});

// Opprett anmeldelse for tur
router.post('/tur/:id', auth, async (req, res) => {
  try {
    const bruker_id = req.user.bruker_id;
    const tur_id = req.params.id;
    const { hytte_rating, hytte_anmeldelse } = req.body;

    await pool.query(
      'SELECT anmeldelse_tur_opprett($1, $2, $3, $4)',
      [bruker_id, tur_id, rating, anmeldelse]
    );

    res.status(201).json({ message: 'Anmeldelse opprettet' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke opprette anmeldelse' });
  }
});

// Slett anmeldelse for tur
router.delete('/tur', async (req, res) => {
  try {
    const { bruker_id, tur_id } = req.body;

    await pool.query(
      'SELECT anmeldelse_tur_slett($1,$2)',
      [bruker_id, tur_id]
    );

    res.json({ message: 'Anmeldelse slettet' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke slette anmeldelse' });
  }
});


// Hent anmeldelser for hytte
router.get('/hytte/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT anmeldelse_hytte_hent_for_hytte($1) AS anmeldelser',
      [req.params.id]
    );

    res.json(result.rows[0].anmeldelser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Feil ved henting av anmeldelser' });
  }
});


// Opprett anmeldelse for hytte
router.post('/hytte/:id', auth, async (req, res) => {
  try {
    const bruker_id = req.user.bruker_id;
    const hytte_id = req.params.id;
    const { rating, anmeldelse } = req.body;

    await pool.query(
      'SELECT anmeldelse_hytte_opprett($1, $2, $3, $4)',
      [bruker_id, hytte_id, hytte_rating, hytte_anmeldelse]
    );

    res.status(201).json({ message: 'Anmeldelse opprettet' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke opprette anmeldelse' });
  }
});


// Slett anmeldelse for hytte
router.delete('/hytte/:id', auth, async (req, res) => {
  try {
    const bruker_id = req.user.bruker_id;
    const hytte_id = req.params.id;

    await pool.query(
      'SELECT anmeldelse_hytte_slett($1, $2)',
      [bruker_id, hytte_id]
    );

    res.json({ message: 'Anmeldelse slettet' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke slette anmeldelse' });
  }
});


// Hent anmeldelser for turmaal
router.get('/turmaal/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT anmeldelse_turmaal_hent_for_turmaal($1) AS anmeldelser',
      [req.params.id]
    );

    res.json(result.rows[0].anmeldelser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Feil ved henting av anmeldelser' });
  }
});

// Opprett anmeldelse for turmaal
router.post('/turmaal/:id', auth, async (req, res) => {
  try {
    const bruker_id = req.user.bruker_id;
    const turmaal_id = req.params.id;
    const { turmaal_rating, turmaal_anmeldelse } = req.body;

    await pool.query(
      'SELECT anmeldelse_turmaal_opprett($1, $2, $3, $4)',
      [bruker_id, turmaal_id, turmaal_rating, turmaal_anmeldelse]
    );

    res.status(201).json({ message: 'Anmeldelse opprettet' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke opprette anmeldelse' });
  }
});


// Slett anmeldelse for turmaal
router.delete('/turmaal/:id', auth, async (req, res) => {
  try {
    const bruker_id = req.user.bruker_id;
    const turmaal_id = req.params.id;

    await pool.query(
      'SELECT anmeldelse_turmaal_slett($1, $2)',
      [bruker_id, turmaal_id]
    );

    res.json({ message: 'Anmeldelse slettet' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke slette anmeldelse' });
  }
});

export default router;

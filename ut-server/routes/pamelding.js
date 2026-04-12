import express from 'express';
import passport from 'passport';
import pool from '../config/db.js';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });



// Meld på eller oppdater status (interessert / bindende)
router.post('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM pamelding_opprett_eller_oppdater($1, $2, $3)`,
      [
        req.user.bruker_id,
        req.params.id,
        req.body.status
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);

    if (err.code === 'P0001') {
      return res.status(400).json({ error: err.message });
    }

    if (err.code === '23505') {
      return res.status(409).json({ error: err.message });
    }

    res.status(500).json({ error: 'Kunne ikke melde på' });
  }
});



// Hent alle fellesturer der bruker er interessert eller har bindende påmelding
router.get('/mine', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT fellestur_hent_mine($1) AS fellesturer`,
      [req.user.bruker_id]
    );

    res.json(result.rows[0].fellesturer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente dine fellesturer' });
  }
});


// Hent brukerens aktive påmelding for en hel fellestur
router.get('/fellestur/:aktivitetId', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM pamelding_hent_for_fellestur($1, $2)`,
      [req.user.bruker_id, req.params.aktivitetId]
    );

    if (result.rows.length === 0) return res.json(null);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente påmelding' });
  }
});


// Hent innlogget brukers påmelding på en spesifikk dato
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM pamelding_hent_for_dato($1, $2)`,
      [req.user.bruker_id, req.params.id]
    );

    if (result.rows.length === 0) return res.json(null);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente påmelding' });
  }
});


// Hent antall deltakere per dato for en hel fellestur
router.get('/fellestur/:aktivitetId/deltakere', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM fellestur_hent_deltakere_per_dato($1)`,
      [req.params.aktivitetId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente deltakere' });
  }
});


// Hent alle deltakere på en spesifikk dato
router.get('/:id/deltakere', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM pamelding_hent_deltakere_for_dato($1)`,
      [req.params.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente deltakere' });
  }
});

// Registrer bildesamtykke for en påmelding
router.post('/:id/bildesamtykke', auth, async (req, res) => {
  try {
    const bruker_id = req.user.bruker_id;
    const aktivitet_id = req.params.id;
    const {samtykke} = req.body;

    //TODO: DB-funksjon når den er klar

    res.json({ message: 'Bildesamtykke registrert' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke registrere bildesamtykke' });
  }
});


// Meld av (sett status til avmeldt)
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query(
      `SELECT pamelding_avmeld($1, $2)`,
      [req.user.bruker_id, req.params.id]
    );

    res.json({ message: 'Avmeldt' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke melde av' });
  }
});


// Lås / åpne påmelding for en aktivitetsdato
router.patch('/dato/:aktivitet_dato_id/pamelding-last', auth, async (req, res) => {
  try {
    const aktivitet_dato_id = req.params.aktivitet_dato_id;
    const { er_last } = req.body;

    const result = await pool.query(
      `SELECT *
       FROM public.aktivitet_dato_sett_pamelding_last($1, $2)`,
      [aktivitet_dato_id, er_last]
    );

    res.json({
      message: er_last ? 'Påmelding låst' : 'Påmelding åpnet',
      data: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke oppdatere lås for påmelding' });
  }
});

// Velg fast dato for aktivitet
router.patch('/dato/:aktivitet_dato_id/velg-fast', auth, async (req, res) => {
  try {
    const aktivitet_dato_id = req.params.aktivitet_dato_id;

    const result = await pool.query(
      `SELECT *
       FROM public.aktivitet_dato_velg_fast_dato($1)`,
      [aktivitet_dato_id]
    );

    res.json({
      message: 'Fast dato valgt',
      data: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke velge fast dato' });
  }
});

export default router;

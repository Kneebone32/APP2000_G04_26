// Skrevet av Kristoffer med mindre annet er spesifisert

import express from 'express';
import passport from 'passport';
import pool from '../config/db.js';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

//Henter alle turruter til kartet
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM turrute_kart_hent();');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});


// Henter alle favoritturene til en bruker
router.get('/favoritter', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const result = await pool.query('SELECT turrute_id FROM favoritt_turrute WHERE bruker_id = $1', [brukerId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente favoritter' });
  }
});

// Legger til en turrute i favoritter
router.post('/favoritter/:id', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const turruteId = req.params.id;
    await pool.query('INSERT INTO favoritt_turrute (bruker_id, turrute_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [brukerId, turruteId]);
    res.status(201).json({ message: 'Favoritt lagt til' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke legge til favoritt' });
  }
});

// Fjerner en turrute fra favoritter
router.delete('/favoritter/:id', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const turruteId = req.params.id;
    await pool.query('DELETE FROM favoritt_turrute WHERE bruker_id = $1 AND turrute_id = $2', [brukerId, turruteId]);
    res.json({ message: 'Favoritt fjernet' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke fjerne favoritt' });
  }
});

// Henter anmeldelser for en turrute
router.get('/:id/anmeldelser', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT anmeldelse_tur_hent_for_tur($1) AS anmeldelser', [id]);
    res.json(result.rows[0].anmeldelser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente anmeldelser' });
  }
});

// Oppretter anmeldelse for en turrute
router.post('/:id/anmeldelser', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const turId = req.params.id;
    const { rating, anmeldelse } = req.body;
    await pool.query('SELECT anmeldelse_tur_opprett($1, $2, $3, $4)', [brukerId, turId, rating, anmeldelse]);
    res.status(201).json({ message: 'Anmeldelse opprettet' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke opprette anmeldelse' });
  }
});

// Oppdaterer anmeldelse for en turrute
router.put('/:id/anmeldelser', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const turId = req.params.id;
    const { rating, anmeldelse } = req.body;
    await pool.query('SELECT anmeldelse_tur_oppdater($1, $2, $3, $4)', [brukerId, turId, rating, anmeldelse]);
    res.json({ message: 'Anmeldelse oppdatert' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke oppdatere anmeldelse' });
  }
});

// Sletter anmeldelse for en turrute
router.delete('/:id/anmeldelser', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const turId = req.params.id;
    await pool.query('SELECT anmeldelse_tur_slett($1, $2)', [brukerId, turId]);
    res.json({ message: 'Anmeldelse slettet' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke slette anmeldelse' });
  }
});

// Henter turrute med gitt id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM turrute WHERE turrute_id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Turrute ikke funnet' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Legger til ny turrute
router.post('/', async (req, res) => {
  try {
    const {
      turrute_navn,
      turrute_omrade,
      beskrivelse,
      vanskelighetsgrad,
      varighet,
      turtype,
      fylke_id,
      kommune_id,
      punkter,
      info_array,
      bilder
    } = req.body;

    // Oppretter turrute med turrute_opprett_med_punkter funksjonen
    const result = await pool.query(
      'SELECT turrute_opprett_med_punkter($1, $2, $3, $4, $5, $6, $7, $8, $9) AS ny_turrute_id',
      [
        turrute_navn,
        turrute_omrade,
        beskrivelse,
        vanskelighetsgrad,
        varighet,
        turtype,
        fylke_id,
        kommune_id,
        JSON.stringify(punkter)
      ]
    );

    const nyTurruteId = result.rows[0].ny_turrute_id;

    // Legger til bilder hvis det finnes
    if (bilder && bilder.length > 0) {
      for (const bildeUrl of bilder) {
        await pool.query('SELECT turrute_bilde_leggtill_auto($1, $2)', [nyTurruteId, bildeUrl]);
      }
    }

    res.status(201).json({
      turrute_id: nyTurruteId,
      message: 'Turrute opprettet'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke legge til turrute' });
  }
});

// Oppdaterer turrute med gitt id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      turrute_navn,
      turrute_omrade,
      beskrivelse,
      vanskelighetsgrad,
      varighet,
      turtype,
      fylke_id,
      kommune_id,
      punkter,
      info_array,
      bilder
    } = req.body;

    // Oppdaterer turrute grunndata
    await pool.query(
      `UPDATE turrute 
       SET turrute_navn = $1, 
           turrute_omrade = $2, 
           beskrivelse = $3, 
           vanskelighetsgrad = $4, 
           varighet = $5, 
           turtype = $6, 
           fylke_id = $7, 
           kommune_id = $8
       WHERE turrute_id = $9`,
      [
        turrute_navn,
        turrute_omrade,
        beskrivelse,
        vanskelighetsgrad,
        varighet,
        turtype,
        fylke_id,
        kommune_id,
        id
      ]
    );

    // Oppdaterer punkter hvis det finnes
    if (punkter && punkter.length > 0) {
      await pool.query('SELECT turrute_punkter_sett_latlng($1, $2)', [
        id,
        JSON.stringify(punkter)
      ]);
    }

    // Legger til nye bilder hvis det finnes
    if (bilder && bilder.length > 0) {
      for (const bildeUrl of bilder) {
        await pool.query('SELECT turrute_bilde_leggtill_auto($1, $2)', [id, bildeUrl]);
      }
    }

    res.json({
      turrute_id: id,
      message: 'Turrute oppdatert'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke oppdatere turrute' });
  }
});

// Sletter turrute med gitt id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Sletter turrute
    const result = await pool.query('DELETE FROM turrute WHERE turrute_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Turrute ikke funnet' });
    }

    res.json({
      turrute_id: id,
      message: 'Turrute slettet'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke slette turrute' });
  }
});

// Henter punkter for en turrute
router.get('/:id/punkter', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT turrute_punkter_hent_latlng($1) AS punkter', [id]);

    res.json(result.rows[0].punkter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente punkter' });
  }
});

export default router;
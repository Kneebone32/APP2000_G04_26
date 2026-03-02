// Skrevet av Kristoffer med mindre annet er spesifisert

import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

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
      info_tab,
      bilder
    } = req.body;

    // Oppretter ny hytte i databasen
    const result = await pool.query(
      'SELECT hytte_opprett_hel($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) AS ny_hytte_id',
      [hytte_navn, hytte_beskrivelse, hytte_sengeplasser, hytte_pris, fylke_nummer, kommune_nummer, hytte_breddegrad, hytte_lengdegrad, hytte_moh, hytte_betjeningsgrad]
    );

    const nyHytteId = result.rows[0].ny_hytte_id;

    // Legger til informasjon om hytten (fasiliteter, adkomst, passer for, osv.) hvis det finnes
    if (info_tab && info_tab.length > 0) {
      await pool.query('SELECT hytte_info_sett($1, $2)', [nyHytteId, info_tab]);
    }

    // Legger til bilder av hytten hvis det finnes
    if (bilder && bilder.length > 0) {
      for (const bildeUrl of bilder) {
        await pool.query('SELECT hytte_bilde_leggtill_auto($1, $2)', [nyHytteId, bildeUrl]);
      }
    }

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
      fylke_id,
      kommune_id,
      hytte_breddegrad,
      hytte_lengdegrad,
      hytte_moh,
      hytte_betjeningsgrad,
      info_tab,
      bilder
    } = req.body;

    // Oppdaterer hytte i databasen med hytte_oppdater funksjonen
    await pool.query(
      'SELECT hytte_oppdater($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [id, hytte_navn, hytte_beskrivelse, hytte_sengeplasser, hytte_pris, fylke_id, kommune_id, hytte_breddegrad, hytte_lengdegrad, hytte_moh, hytte_betjeningsgrad]
    );

    // Oppdaterer informasjon om hytten (fasiliteter, adkomst, passer for, osv.) hvis det finnes
    if (info_tab && info_tab.length > 0) {
      await pool.query('SELECT hytte_info_sett($1, $2)', [id, info_tab]);
    }

    // Oppdaterer bilder av hytten hvis det finnes
    if (bilder && bilder.length > 0) {
      for (const bildeUrl of bilder) {
        await pool.query('SELECT hytte_bilde_leggtill_auto($1, $2)', [id, bildeUrl]);
      }
    }

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
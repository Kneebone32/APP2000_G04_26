// Skrevet av Kristoffer med mindre annet er spesifisert

import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

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

    // 1. Opprett turrute med turrute_opprett_med_punkter funksjonen
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
        JSON.stringify(punkter) // konverterer til JSONB
      ]
    );

    const nyTurruteId = result.rows[0].ny_turrute_id;

    // 2. Legg til informasjon hvis det finnes
    if (info_array && info_array.length > 0) {
      await pool.query('SELECT turrute_info_sett($1, $2)', [nyTurruteId, info_array]);
    }

    // 3. Legg til bilder hvis det finnes
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

    // 1. Oppdater turrute grunndata
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

    // 2. Oppdater punkter hvis det finnes
    if (punkter && punkter.length > 0) {
      await pool.query('SELECT turrute_punkter_sett_latlng($1, $2)', [
        id,
        JSON.stringify(punkter)
      ]);
    }

    // 3. Oppdater informasjon hvis det finnes
    if (info_array && info_array.length > 0) {
      await pool.query('SELECT turrute_info_sett($1, $2)', [id, info_array]);
    }

    // 4. Legg til nye bilder hvis det finnes
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

    // Sletter turrute (CASCADE vil slette tilknyttede punkter, bilder og informasjon)
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

// Henter punkter for en turrute i lat/lng format
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
import express from 'express';
import pool from '../config/db.js';

const router = express.Router();


// Opprett ny aktivitet
router.post('/', async (req, res) => {
  try {
    const {
      aktivitet_tittel,
      aktivitet_beskrivelse,
      turrute_id,
      bruker_id,
      aktivitet_min_deltakere,
      aktivitet_maks_deltakere,
      datoer,              
      aktivitet_status    
    } = req.body;

    const result = await pool.query(
      `
      SELECT public.aktivitet_opprett(
        $1, $2, $3, $4, $5, $6, $7::jsonb, $8::aktivitet_status_enum
      ) AS aktivitet_id
      `,
      [
        aktivitet_tittel,
        aktivitet_beskrivelse,
        turrute_id,
        bruker_id,
        aktivitet_min_deltakere,
        aktivitet_maks_deltakere,
        datoer ? JSON.stringify(datoer) : '[]',
        (aktivitet_status ?? 'utkast')
      ]
    );

    const aktivitetId = result.rows[0].aktivitet_id;

    res.status(201).json({
      aktivitet_id: aktivitetId,
      message: 'Aktivitet opprettet'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke opprette aktivitet' });
  }
});


//Hente aktivitet


export default router;

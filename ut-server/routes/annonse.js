import express from 'express';
import passport from 'passport';
import pool from '../config/db.js';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });


// Hent alle annonser
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM public.annonse_hent_alle()'
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente annonser' });
  }
});

// Opprett annonse
router.post('/', auth, async (req, res) => {
  try {
    const bruker_id = req.user.bruker_id;

    //Finn en admin som skal motta varselet (temp)
    const adminResult = await pool.query(
        `SELECT br.bruker_id FROM bruker_rolle br
         JOIN rolle r USING (rolle_id)
         WHERE r.rolle_navn = 'admin'
         LIMIT 1`
    );
    if (adminResult.rows.length === 0) {
        return res.status(404).json({ error: 'Ingen admin funnet' });
    }
    const mottaker_id = adminResult.rows[0].bruker_id;

    const {
      annonse_navn,
      tittel,
      beskrivelse,
      bilde_url,
      sokeord,
      start_dato,
      slutt_dato
    } = req.body;

    const result = await pool.query(
      `SELECT public.annonse_opprett($1, $2, $3, $4, $5, $6, $7::text[], $8, $9) AS annonse_id`,
      [
        bruker_id,
        mottaker_id,
        annonse_navn,
        tittel,
        beskrivelse,
        bilde_url,
        sokeord,
        start_dato,
        slutt_dato
      ]
    );

    res.status(201).json({
      message: 'Annonse opprettet',
      annonse_id: result.rows[0].annonse_id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke opprette annonse' });
  }
});

// Hent én annonse
router.get('/:id', async (req, res) => {
    try {
        const annonse_id = req.params.id;

        const result = await pool.query(
            `SELECT * FROM public.annonse_hent($1)`,
            [annonse_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Annonse ikke funnet' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kunne ikke hente annonse' });
    }
});

// Registrer visning
router.post('/:id/visning', async (req, res) => {
    try {
        const annonse_id = req.params.id;

        await pool.query(
            `SELECT public.annonse_registrer_visning($1)`,
            [annonse_id]
        );

        res.json({ message: 'Visning registrert' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kunne ikke registrere visning' });
    }
});

// Registrer klikk
router.post('/:id/klikk', async (req, res) => {
    try {
        const annonse_id = req.params.id;

        await pool.query(
            `SELECT public.annonse_registrer_klikk($1)`,
            [annonse_id]
        );

        res.json({ message: 'Klikk registrert' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kunne ikke registrere klikk' });
    }
});

// Oppdater annonse laget av AI.
router.put('/:id', auth, async (req, res) => {
    const client = await pool.connect();
    try {
        const annonse_id = req.params.id;
        const bruker_id = req.user.bruker_id;

        const { annonse_navn, tittel, beskrivelse, bilde_url, sokeord, start_dato, slutt_dato } = req.body;

        await client.query('BEGIN');

        const result = await client.query(
            `UPDATE annonse
             SET annonse_navn = $1, tittel = $2, beskrivelse = $3, bilde_url = $4,
                 start_dato = $5, slutt_dato = $6
             WHERE annonse_id = $7 AND bruker_id = $8
             RETURNING *`,
            [annonse_navn, tittel, beskrivelse, bilde_url, start_dato, slutt_dato, annonse_id, bruker_id]
        );

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Annonse ikke funnet eller du har ikke tilgang' });
        }

        await client.query(
            `DELETE FROM annonse_sokeord_kobling WHERE annonse_id = $1`,
            [annonse_id]
        );

        if (sokeord && sokeord.length > 0) {
            await client.query(
                `INSERT INTO annonse_sokeord_kobling (annonse_id, sokeord_id)
                 SELECT $1, s.sokeord_id FROM annonse_sokeord s WHERE s.navn = ANY($2::text[])`,
                [annonse_id, sokeord]
            );
        }

        await client.query('COMMIT');
        res.json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Kunne ikke oppdatere annonse' });
    } finally {
        client.release();
    }
});


// Slett annonse
router.delete('/:id', auth, async (req, res) => {
    try {
        const annonse_id = req.params.id;

        await pool.query(
            `SELECT public.annonse_slett($1)`,
            [annonse_id]
        );

        res.json({ message: 'Annonse slettet' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kunne ikke slette annonse' });
    }
});

export default router;

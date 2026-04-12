// Skrevet av Kristoffer med mindre annet er spesifisert

import express from 'express';
import pool from '../config/db.js';
import passport from 'passport';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

// Henter alle varsler for innlogget bruker
router.get('/', auth, async (req, res) => {
  try {
    const bruker_id = req.user.bruker_id;
    const result = await pool.query(
      'SELECT * FROM public.varsel_hent_alle($1)',
      [bruker_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Feil ved henting av varsler:', err);
    res.status(500).json({ error: 'Kunne ikke hente varsler' });
  }
});

// Oppretter en rolle-forespørsel
router.post('/rolle-foresporsel', auth, async (req, res) => {
    try {
        const bruker_id = req.user.bruker_id;
        const { rolle_id } = req.body;

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

        await pool.query('SELECT bruker_rolle_foresporsel_opprett($1, $2, $3)', [bruker_id, rolle_id, mottaker_id]);
        res.status(201).json({ message: 'Forespørsel sendt' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kunne ikke sende forespørsel' });
    }
});




// Oppretter nytt varsel (internt)
router.post('/', auth, async (req, res) => {
  try {
    const { mottaker_id, type_id, tittel, innhold, referanse_type, referanse_id } = req.body;
    const avsender_id = req.user.bruker_id;

    if (!mottaker_id || !type_id || !tittel || !innhold) {
      return res.status(400).json({ error: 'mottaker_id, type_id, tittel og innhold er påkrevd' });
    }

    const result = await pool.query(
      `INSERT INTO public.varsel (mottaker_id, avsender_id, type_id, tittel, innhold, status, opprettet_tidspunkt, referanse_type, referanse_id)
       VALUES ($1, $2, $3, $4, $5, 'ulest', NOW(), $6, $7)
       RETURNING varsel_id`,
      [mottaker_id, avsender_id, type_id, tittel, innhold, referanse_type ?? null, referanse_id ?? null]
    );

    res.status(201).json({ varsel_id: result.rows[0].varsel_id });
  } catch (err) {
    console.error('Feil ved opprettelse av varsel:', err);
    res.status(500).json({ error: 'Kunne ikke opprette varsel' });
  }
});


// Merker varsel som lest
router.patch('/:id/lest', auth, async (req, res) => {
  try {
    const varsel_id = req.params.id;
    const bruker_id = req.user.bruker_id;

    const result = await pool.query(
      'SELECT public.varsel_sett_lest($1, $2) AS success',
      [varsel_id, bruker_id]
    );

    if (!result.rows[0].success) {
      return res.status(404).json({ error: 'Fant ikke varsel, eller varselet er ikke ulest' });
    }

    res.json({ message: 'Varsel markert som lest' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke oppdatere varsel' });
  }
});



// Behandler en oppgave (godkjenn/avslå)
router.post('/:id/behandle', auth, async (req, res) => {
  try {
    const varsel_id = parseInt(req.params.id);
    const { beslutning } = req.body;

    if (typeof beslutning !== 'boolean') {
      return res.status(400).json({ error: 'beslutning må være true eller false' });
    }

    await pool.query(
      'SELECT public.varsel_oppgave_behandle($1, $2)',
      [varsel_id, beslutning]
    );

    res.json({ melding: beslutning ? 'Oppgave godkjent' : 'Oppgave avslått' });
  } catch (err) {
    console.error('Feil ved behandling av varsel-oppgave:', err);
    const melding = err.message ?? 'Kunne ikke behandle oppgave';
    res.status(400).json({ error: melding });
  }
});

//Henter ett varsel
router.get('/:id', auth, async (req, res) => {
  try {
    const bruker_id = req.user.bruker_id;
    const varsel_id = parseInt(req.params.id);
    
    const result = await pool.query(
      `SELECT * FROM public.varsel_hent_alle($1) WHERE varsel_id = $2`,
      [bruker_id, varsel_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Feil ved henting av varsel:', err);
    res.status(500).json({ error: 'Kunne ikke hente varsel' });
  }
});



// Slett varsel
router.delete('/:id', auth, async (req, res) => {
  try {
    const varsel_id = req.params.id;

    await pool.query(
      'SELECT public.varsel_slett($1)',
      [varsel_id]
    );

    res.json({ message: 'Varsel slettet' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke slette varsel' });
  }
});

export default router;

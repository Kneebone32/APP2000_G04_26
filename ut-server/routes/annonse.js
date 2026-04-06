import express from 'express';
import passport from 'passport';
import pool from '../config/db.js';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });


// Opprett annonse
router.post('/', auth, async (req, res) => {
    try {
        const bruker_id = req.user.bruker_id;

        const {
            annonse_navn,
            tittel,
            beskrivelse,
            bilde_url,
            sokeord,
            start_dato,
            slutt_dato,
            status
        } = req.body;

        const result = await pool.query(
            `SELECT public.annonse_opprett($1, $2, $3, $4, $5, $6, $7, $8, $9) AS annonse_id`,
            [
                bruker_id,
                annonse_navn,
                tittel,
                beskrivelse,
                bilde_url,
                sokeord,
                start_dato,
                slutt_dato,
                status || 'inaktiv'
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

export default router;

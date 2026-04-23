import express from "express";
import pool from "../config/db.js";
import passport from "passport";

const router = express.Router();
const auth = passport.authenticate("jwt", { session: false });

//Laget av Kay, men basert på de andre rutene til Kristoffer
//Tilbakestiller databasen til backup. Krever admin-rolle.
router.post("/tilbakestill", auth, async (req, res) => {
  try {
    const bruker_id = req.user.bruker_id;

    const adminSjekk = await pool.query(
      `SELECT br.bruker_id FROM bruker_rolle br
       JOIN rolle r USING (rolle_id)
       WHERE r.rolle_navn = 'admin'
       AND br.bruker_id = $1`,
      [bruker_id],
    );

    if (adminSjekk.rows.length === 0) {
      return res.status(403).json({ error: "Ingen tilgang" });
    }

    await pool.query("SELECT public.demo_reset()");
    res.json({ message: "Databasen er tilbakestilt" });
  } catch (err) {
    console.error("Feil ved tilbakestilling av database:", err);
    res.status(500).json({ error: "Kunne ikke tilbakestille databasen" });
  }
});

export default router;

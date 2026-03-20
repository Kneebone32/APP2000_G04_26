import { useState } from 'react';
import { toast } from 'react-toastify';
import './AnmeldelseListe.css';

//Skjema for å skrive en ny anmeldelse med stjernerating. Laget av Kay
export default function AnmeldelseSkjema({onSend, loading}) {
    const [stjerner, setStjerner] = useState(0);
    const [hoverStjerner, setHoverStjerner] = useState(0);
    const [kommentar, setKommentar] = useState('');

    const handleSend = async (e) => {
        e.preventDefault();
        if (stjerner === 0) {
            toast.warning("Velg antall stjerner");
            return;
        }
        try {
            await onSend({stjerner, kommentar: kommentar.trim()});
            toast.success("Anmeldelse sendt!");
            setStjerner(0);
            setKommentar('');
        } catch {
            toast.error("Noe gikk galt ved innsending av anmeldelse");
        }
    };

    return (
        <form className="anmeldelse-skjema" onSubmit={handleSend}>
            <h3>Skriv en anmeldelse</h3>

            <div className="anmeldelse-stjerne-velger">
                {[1, 2, 3, 4, 5].map((antall) => (
                    <span
                        key={antall}
                        className={`anmeldelse-stjerne ${antall <= (hoverStjerner || stjerner) ? 'aktiv' : ''}`}
                        onClick={() => setStjerner(antall)}
                        onMouseEnter={() => setHoverStjerner(antall)}
                        onMouseLeave={() => setHoverStjerner(0)}
                    >
                        ★
                    </span>
                ))}
            </div>
            <textarea
                className="anmeldelse-textarea"
                value={kommentar}
                onChange={(e) => setKommentar(e.target.value)}
                placeholder="Skriv en kommentar (valgfritt)"
                rows={3}
            />
            <button type="submit" className="anmeldelse-send-btn" disabled={stjerner === 0 || loading}>
                Send anmeldelse
            </button>
        </form>
    );
}

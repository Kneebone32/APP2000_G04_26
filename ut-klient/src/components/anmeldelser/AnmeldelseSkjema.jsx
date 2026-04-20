import { useState } from 'react';
import { toast } from 'react-toastify';
import './AnmeldelseListe.css';
import { useTranslation } from 'react-i18next';

//Skjema for å skrive en ny anmeldelse med stjernerating. Laget av Kay
export default function AnmeldelseSkjema({onSend, loading}) {
    const { t } = useTranslation();
    const [rating, setRating] = useState(0);
    const [hoverStjerner, setHoverStjerner] = useState(0);
    const [kommentar, setKommentar] = useState('');

    const handleSend = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.warning(t("anmeldelse.velg_stjerner"));
            return;
        }
        try {
            await onSend({rating, anmeldelse: kommentar.trim()});
            toast.success(t("anmeldelse.sendt"));
            setRating(0);
            setKommentar('');
        } catch {
            toast.error(t("anmeldelse.feil_innsending"));
        }
    };

    return (
        <form className="anmeldelse-skjema" onSubmit={handleSend}>
            <h3>{t("anmeldelse.skriv")}</h3>

            <div className="anmeldelse-stjerne-velger">
                {[1, 2, 3, 4, 5].map((antall) => (
                    <span
                        key={antall}
                        className={`anmeldelse-stjerne ${antall <= (hoverStjerner || rating) ? 'aktiv' : ''}`}
                        onClick={() => setRating(antall)}
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
                placeholder={t("anmeldelse.kommentar_placeholder")}
                rows={3}
            />
            <button type="submit" className="anmeldelse-send-btn" disabled={rating === 0 || loading}>
                {t("anmeldelse.send")}
            </button>
        </form>
    );
}

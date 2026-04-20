import './AnmeldelseListe.css';
import { formatNorskdato } from '../../utils/datoUtils';
import { useTranslation } from 'react-i18next';

//Viser liste over anmeldelser med stjerner og kommentar. Laget av Kay
export default function AnmeldelseListe({anmeldelser, gjennomsnittsrating, rating, kommentar, tid, loading, error, brukerId, onSlett}) {
    const { t } = useTranslation();
    const tegnStjerner = (antall) => '★'.repeat(antall) + '☆'.repeat(5 - antall);
    //if (loading || error) return;

    return (
        <div className="anmeldelse-liste">
            <div className="anmeldelse-liste-header">
                <h3>{t("anmeldelse.tittel")}</h3>
                {gjennomsnittsrating && (
                    <span className="anmeldelse-gjennomsnitt">
                        <span className="anmeldelse-stjerner">★</span> {gjennomsnittsrating} / 5 ({anmeldelser.length})
                    </span>
                )}
            </div>

            {/*Alle anmeldelser*/}
            {anmeldelser.length !== 0 && (
                anmeldelser.map((anmeldelse) => (
                    <div key={anmeldelse.bruker_id} className="anmeldelse-kort">
                        <div className="anmeldelse-kort-header">
                            <span className="anmeldelse-navn">{anmeldelse.bruker_navn}</span>
                            <span className="anmeldelse-stjerner">{tegnStjerner(anmeldelse[rating])}</span>
                        </div>
                        {anmeldelse[kommentar] && <p className="anmeldelse-kommentar">{anmeldelse[kommentar]}</p>}
                        <div className="anmeldelse-kort-footer">
                            <span className="anmeldelse-dato">
                                {formatNorskdato(new Date(anmeldelse[tid]))}
                            </span>
                            {brukerId && brukerId === anmeldelse.bruker_id && (
                                <button
                                    className="anmeldelse-slett-btn"
                                    onClick={() => onSlett(anmeldelse.bruker_id)}
                                >
                                    {t("felles.slett")}
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

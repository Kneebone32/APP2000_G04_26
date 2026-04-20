import './SamtaleListe.css';
import { useTranslation } from 'react-i18next';

//Liste over alle samtalene til bruker. Laget av Kay
export default function SamtaleListe({samtaler, valgtId, onVelg}) {
    const { t } = useTranslation();
    return (
        <div className="samtale-liste">
            <h3 className="samtale-liste-tittel">{t("meldinger.tittel")}</h3>

            {samtaler.length === 0 && (
                <p className="samtale-liste-tom">{t("meldinger.ingen_samtaler")}</p>
            )}

            {/*liste over alle samtaler*/}
            {samtaler.map((samtale) => {
                const erValgt = samtale.samtale_id === valgtId;
                return (
                    <button
                        key={samtale.samtale_id}
                        className={`samtale-rad ${erValgt ? 'samtale-rad-aktiv' : ''}`}
                        onClick={() => onVelg(samtale)}
                    >
                        <div className="samtale-rad-info">
                            <span className="samtale-navn">{samtale.visningsnavn}</span>
                            {samtale.siste_melding && (
                                <span className="samtale-forhåndsvisning">{samtale.siste_melding}</span>
                            )}
                        </div>
                        {Number(samtale.antall_uleste_meldinger) > 0 && (
                            <span className="samtale-uleste">{Number(samtale.antall_uleste_meldinger)}</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

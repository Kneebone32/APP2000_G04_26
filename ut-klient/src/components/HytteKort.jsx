import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import './Hyttekort.css';

export default function HytteKort({hytteId, hytteNavn, sengeplasser, bildeUrl}) {
    const { t } = useTranslation();
    return (
        <div className="Hyttekort">
            <Link to={`/hytter/${hytteId}`} className="Hyttelink">
                <div className="Hovedkort">
                    {bildeUrl && (
                        <img 
                            src={`${bildeUrl}?w=200&h=200&fit=fit`} 
                            alt={hytteNavn}
                            className="Hyttebilde"
                            />
                    )}
                    <div className="kortbody">
                        <h3 className="korttitle">{hytteNavn}</h3>
                        <p className="korttext">{t("felles.antall_sengeplasser")}: {sengeplasser}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
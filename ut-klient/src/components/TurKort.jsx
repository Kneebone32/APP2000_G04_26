import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import './TurKort.css';

export default function TurKort({turId, turNavn, vanskelighetsgrad, bildeUrl}) {
    const { t } = useTranslation();
    return (
        <div className="Turkort">
            <Link to={`/turer/${turId}`} className="TurLink">
                <div className="Hovedkort">
                    {bildeUrl && (
                        <img 
                            src={`${bildeUrl}?w=200&h=200&fit=fit`} 
                            alt={turNavn}
                            className="TurBilde"
                            />
                    )}
                    <div className="kortbody">
                        <h3 className="korttitle">{turNavn}</h3>
                        <p className="korttext">{t("tur.vanskelighetsgrad")}: {vanskelighetsgrad}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
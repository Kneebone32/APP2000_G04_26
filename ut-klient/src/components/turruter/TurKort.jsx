import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hentKommuneData } from "../../utils/geoUtils";
import './TurKort.css';

export default function TurKort({turId, turNavn, vanskelighetsgrad, bildeUrl, turtype, varighet, lat, lon}) {
    const { t } = useTranslation();
    const [kommunenavn, setKommunenavn] = useState("");
    const [fylkesnavn, setFylkesnavn] = useState("");

    useEffect(() => {
        if (!lat || !lon) return;
        hentKommuneData(lat, lon)
            .then(data => {
                if (data) {
                    setKommunenavn(data.kommunenavn || "");
                    setFylkesnavn(data.fylkesnavn || "");
                }
            })
            .catch(() => {});
    }, [lat, lon]);

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
                        <p className="korttext">{t("tur.turtype")}: {turtype}</p>
                        <p className="korttext">{t("tur.varighet")}: {varighet}</p>
                        {kommunenavn && <p className="korttext">{t("felles.kommune")}: {kommunenavn}</p>}
                        {fylkesnavn && <p className="korttext">{t("felles.fylke")}: {fylkesnavn}</p>}
                    </div>
                </div>
            </Link>
        </div>
    );
}
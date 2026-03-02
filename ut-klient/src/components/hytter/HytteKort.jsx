import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hentKommuneData } from "../../utils/geoUtils";
import './Hyttekort.css';

export default function HytteKort({hytteId, hytteNavn, sengeplasser, bildeUrl, pris, lat, lon}) {
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
                        {pris !== undefined && <p className="korttext">{t("hytter.pris")}: {pris} kr</p>}
                        {kommunenavn && <p className="korttext">{t("felles.kommune")}: {kommunenavn}</p>}
                        {fylkesnavn && <p className="korttext">{t("felles.fylke")}: {fylkesnavn}</p>}
                    </div>
                </div>
            </Link>
        </div>
    );
}
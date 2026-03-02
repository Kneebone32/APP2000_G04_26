/* 
Laget av Eivind
*/

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hentKommuneData } from "../../utils/geoUtils";
import { FaClock, FaHiking, FaBicycle, FaSkiing } from "react-icons/fa";
import './TurKort.css';

export default function TurKort({turId, turNavn, vanskelighetsgrad, bildeUrl, turtype, varighet, lat, lon}) {
    const { t } = useTranslation();
    const [kommunenavn, setKommunenavn] = useState("");
    const [fylkesnavn, setFylkesnavn] = useState("");

    const getTurtypeIcon = () => {
        switch(turtype?.toLowerCase()) {
            case 'fottur':
                return <FaHiking className="turtype-icon" />;
            case 'sykkeltur':
                return <FaBicycle className="turtype-icon" />;
            case 'skitur':
                return <FaSkiing className="turtype-icon" />;
            default:
                return null;
        }
    };

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
                        {kommunenavn && <p className="kommune">{t("felles.kommune")}: {kommunenavn}</p>}
                        {fylkesnavn && <p className="fylke">{t("felles.fylke")}: {fylkesnavn}</p>}
                        <p className="korttext">{getTurtypeIcon()} {vanskelighetsgrad}</p>
                        <p className="korttext"><FaClock className="kortklokke" /> {varighet}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
/* 
Laget av Eivind
*/

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hentKommuneData } from "../../utils/geoUtils";
import { toast, Flip } from "react-toastify";
import { FaClock, FaHiking, FaBicycle, FaSkiing, FaHeart, FaRegHeart } from "react-icons/fa";
import './TurKort.css';

export default function TurKort({turId, turNavn, vanskelighetsgrad, bildeUrl, turtype, varighet, lat, lon, erFavoritt, onToggleFavoritt}) {
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

    const handleFavoritt = (e) => {
        e.preventDefault();
        toast.warning("Pfft, du har ikke prøvd denne turen! Jeg er ikke så lettlurt! Prøv igjen senere ", {
            progress: undefined,
            theme: "dark",
            transition: Flip
            });
        //onToggleFavoritt?.(turId);
    };

    return (
        <div className="Turkort">
            <Link to={`/turer/${turId}`} className="TurLink">
                <div className="Hovedkort">
                    <div className="turkort-bilde-wrapper">
                        {bildeUrl && (
                            <img
                                src={`${bildeUrl}?w=200&h=200&fit=fit`}
                                alt={turNavn}
                                className="TurBilde"
                            />
                        )}
                        {onToggleFavoritt && (
                            <button className="favoritt-knapp" onClick={handleFavoritt} aria-label="Favoritt">
                                {erFavoritt ? <FaHeart className="favoritt-ikon aktiv" /> : <FaRegHeart className="favoritt-ikon" />}
                            </button>
                        )}
                    </div>
                    <div className="kortbody">
                        <h3 className="korttitle">{turNavn}</h3>
                        {kommunenavn && <p className="kommune">{t("felles.kommune")}: {kommunenavn}</p>}
                        {fylkesnavn && <p className="fylke">{t("felles.fylke")}: {fylkesnavn}</p>}
                        <p className="korttext">{getTurtypeIcon()} {t(`enums.vanskelighetsgrad.${vanskelighetsgrad}`)}</p>
                        <p className="korttext"><FaClock className="kortklokke" /> {t(`enums.varighet.${varighet}`)}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
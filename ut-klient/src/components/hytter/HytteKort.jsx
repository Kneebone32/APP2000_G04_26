import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Flip, toast } from 'react-toastify';
import { FaBed, FaMoneyCheckAlt, FaHeart, FaRegHeart } from "react-icons/fa";
import './Hyttekort.css';

// Viser et klikkbart hyttekort med bilde, sted, sengeplasser og eventuell pris. Laget av Olai og Eivind.
export default function HytteKort({hytteId, hytteNavn, sengeplasser, bildeUrl, pris, fylkeId, kommuneId, erFavoritt, onToggleFavoritt}) {
    const { t } = useTranslation();

    const handleFavoritt = (e) => {
        e.preventDefault();
            toast.warning("Åja, du vil legge hytten som favoritt? Hvordan kan den være en favoritt hvis du aldri har vært der?! ", {
            progress: undefined,
            theme: "dark",
            transition: Flip
            });
        //onToggleFavoritt?.(hytteId);
    };

    return (
        <div className="Hyttekort">
            <Link to={`/hytter/${hytteId}`} className="Hyttelink">
                <div className="Hovedkort">
                    <div className="hyttekort-bilde-wrapper">
                        {bildeUrl && (
                            <img
                                // Legger på bildeparametre for simple-file-upload URL-er for mindre forhåndsvisning.
                                src={bildeUrl.includes("simplefileupload") ? `${bildeUrl}?w=200&h=200&fit=fit` : bildeUrl}
                                alt={hytteNavn}
                                className="Hyttebilde"
                            />
                        )}
                        {onToggleFavoritt && (
                            <button className="favoritt-knapp" onClick={handleFavoritt}>
                                {erFavoritt ? <FaHeart className="favoritt-ikon aktiv" /> : <FaRegHeart className="favoritt-ikon" />}
                            </button>
                        )}
                    </div>
                    <div className="kortbody">
                        <h3 className="korttitle">{hytteNavn}</h3>
                        <p className="kommune">{t("felles.kommune")}: {kommuneId}</p>
                        <p className="fylke">{t("felles.fylke")}: {fylkeId}</p>
                        <p className="korttext"> <FaBed className="seng" /> {sengeplasser} {t("felles.antall_sengeplasser")}</p>
                        {pris !== undefined && <p className="korttext"> <FaMoneyCheckAlt className="penger" /> {pris} {t("hytter.pris")}</p>}
                    </div>
                </div>
            </Link>
        </div>
    );
}
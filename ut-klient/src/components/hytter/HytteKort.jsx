/* 
Laget av Eivind
*/

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaBed, FaMoneyCheckAlt } from "react-icons/fa";
import './Hyttekort.css';

export default function HytteKort({hytteId, hytteNavn, sengeplasser, bildeUrl, pris, fylkeId, kommuneId}) {
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
                        <p className="kommune">{t("felles.kommune")}: {kommuneId}</p>
                        <p className="fylke">{t("felles.fylke")}: {fylkeId}</p>
                        <p className="korttext"> <FaBed className="seng" /> {sengeplasser} {t("felles.antall_sengeplasser")}:</p>
                        {pris !== undefined && <p className="korttext"> <FaMoneyCheckAlt className="penger" /> {pris} {t("hytter.pris")}:</p>}
                    </div>
                </div>
            </Link>
        </div>
    );
}
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatFellesturDato } from "../../utils/datoUtils";
import './FellesturKort.css';

export default function FellesturKort({fellesturId, fellesturNavn, bildeUrl, startDato, sluttDato}) {
    const { t } = useTranslation();
    return (
        <div className="Fellesturkort">
            <Link to={`/fellesturer/${fellesturId}`} className="FellesturLink">
                <div className="Hovedkort">
                    {bildeUrl && (
                        <img 
                            src={`${bildeUrl}?w=200&h=200&fit=fit`} 
                            alt={fellesturNavn}
                            className="FellesturBilde"
                            />
                    )}
                    <div className="kortbody">
                        <h3 className="korttitle">{fellesturNavn}</h3>
                        <p className="startdato">Start: {formatFellesturDato(startDato)}</p>
                        <p className="sluttdato">Slutt: {formatFellesturDato(sluttDato)}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
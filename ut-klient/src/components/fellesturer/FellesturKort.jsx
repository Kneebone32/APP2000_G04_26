import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import './FellesturKort.css';

export default function FellesturKort({fellesturId, fellesturNavn, bildeUrl}) {
    const { t } = useTranslation();
    return (
        <div className="FellesturKort">
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
                    </div>
                </div>
            </Link>
        </div>
    );
}
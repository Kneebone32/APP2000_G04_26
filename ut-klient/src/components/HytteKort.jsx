import { Link } from "react-router-dom";
import './Hyttekort.css';

export default function HytteKort({hytteId, hytteNavn, sengeplasser}) {
    return (
        <div className="Hyttekort">
            <Link to={`/hytter/${hytteId}`} className="Hyttelink">
                <div className="Hovedkort">
                    <div className="kortbody">
                        <h3 className="korttitle">{hytteNavn}</h3>
                        <p className="korttext">Antall sengeplasser: {sengeplasser}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
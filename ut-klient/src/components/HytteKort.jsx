import { Link } from "react-router-dom";

export default function HytteKort({hytteId, hytteNavn, sengeplasser}) {
    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
            <Link to={`/hytter/${hytteId}`} className="text-decoration-none">
                <div className="hyttekort card h-100">
                    <div className="card-body">
                        <h3 className="card-title">{hytteNavn}</h3>
                        <p className="card-text">Antall sengeplasser: {sengeplasser}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
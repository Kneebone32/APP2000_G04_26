import { formatNorskdato } from "../../../utils/datoUtils";

//refactor for å holde LegTilFellestur mindre. Laget av Kay
//
export default function DatoListe({ valgteDatoer, onSlett }) {
    if (valgteDatoer.length === 0) return null;

    return (
        <div className="valgtedatoer">
            {valgteDatoer.map((dato, index) => (
                <span key={index} className="dato-valg">
                    {formatNorskdato(dato)}
                    <button 
                        type="button" 
                        style={{ marginLeft: "5px" }} 
                        onClick={() => onSlett(dato)}
                    >
                        x
                    </button>
                </span>
            ))}
        </div>
    );
}
import { formatNorskdato } from "../../../utils/datoUtils";
import { VærvarselDagDetaljert } from "../../Værvarsling";
import "./DatoListe.css"

//refactor for å holde LegTilFellestur mindre. Laget av Kay
//
export default function DatoListe({ valgteDatoer, onSlett, lat, lon}) {
    if (valgteDatoer.length === 0) return null;

    return (
        <div className="valgtedatoer">
            {valgteDatoer.map((dato, index) => (
                <div className="dato-valg-box" key={index}>
                <span className="dato-valg">
                    {formatNorskdato(dato)}
                    <button 
                        type="button" 
                        style={{ marginLeft: "5px" }} 
                        onClick={() => onSlett(dato)}
                    >
                        x
                    </button>

                </span>
                <div className="værvarsel" >
                <VærvarselDagDetaljert
                 lat={lat}
                 lon={lon}
                 dato={new Date(dato)}
                 />
                 </div>
                 </div>
            ))}
        </div>
    );
}
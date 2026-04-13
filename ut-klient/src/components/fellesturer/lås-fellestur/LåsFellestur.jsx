import { useState } from "react";
import { useFellestur } from "../../../hooks/useFellesturer";
import { usePåmelding } from "../../../hooks/usePåmelding";
import { useAutentisering } from "../../../hooks/useAutentisering";
import FellesturSøk from "../FellesturSøk";
import { formatNorskdato } from "../../../utils/datoUtils";
import { DATO_STATUS } from "../../../constants/konstanter";
import { toast } from "react-toastify";
import "../lås-dato/LåsDato.css";

//Låser/åpner påmelding for datoer på en fellestur. Laget av Kay
//fellesturer-prop brukes av turleder for å begrense søk til egne turer
export default function LåsFellestur({fellesturer: fellesturer_prop} = {}) {
    const { token } = useAutentisering({ autoFetch: false });
    const { fellesturer: fellesturer_alle, hentFellesturFraId } = useFellestur({ autoFetch: !fellesturer_prop });
    const { låsPåmelding } = usePåmelding({ token });
    const [valgtData, setValgtData] = useState(null);
    const [lasterFellestur, setLasterFellestur] = useState(false);
    const [lasterDatoId, setLasterDatoId] = useState(null);
    const fellesturer = fellesturer_prop ?? fellesturer_alle;

    const handleSøkSelect = async (id) => {
        if (!id) { setValgtData(null); return; }
        setLasterFellestur(true);
        try {
            const data = await hentFellesturFraId(id);
            setValgtData(data);
        } catch (err) {
            toast.error("Kunne ikke hente fellestur: " + err.message);
            setValgtData(null);
        } finally {
            setLasterFellestur(false);
        }
    };

    const handleToggleLås = async (dato) => {
        setLasterDatoId(dato.aktivitet_dato_id);
        const nyVerdi = !dato.er_last_for_pamelding;
        try {
            const result = await låsPåmelding(dato.aktivitet_dato_id, nyVerdi);
            setValgtData(prev => ({
                ...prev,
                datoer: prev.datoer.map(d =>
                    d.aktivitet_dato_id === result.aktivitet_dato_id
                        ? { ...d, er_last_for_pamelding: result.er_last_for_pamelding }
                        : d
                )
            }));
            toast.success(nyVerdi ? "Påmelding stengt" : "Påmelding åpnet");
        } catch (err) {
            toast.error("Kunne ikke oppdatere: " + err.message);
        } finally {
            setLasterDatoId(null);
        }
    };

    const synligeDatoer = valgtData?.datoer?.filter(d => d.aktivitet_dato_status !== DATO_STATUS.AVLYST) ?? [];

    return (
        <div className="fellestur-form-container">
            <h2>Lås fellestur</h2>

            <FellesturSøk
                fellesturer={fellesturer}
                onSelect={handleSøkSelect}
                lagretTittel={valgtData?.aktivitet_tittel}
            />

            {!lasterFellestur && valgtData && synligeDatoer.length > 0 && (
                <ul className="låsdato-liste">
                    {synligeDatoer.map((dato) => (
                        <li key={dato.aktivitet_dato_id} className="låsdato-label">
                            <span>{formatNorskdato(new Date(dato.aktivitet_start_dato))}</span>
                            <span>{dato.er_last_for_pamelding ? " · Påmelding stengt" : " · Påmelding åpen"}</span>
                            <button
                                type="button"
                                onClick={() => handleToggleLås(dato)}
                                disabled={lasterDatoId === dato.aktivitet_dato_id}
                            >
                                {dato.er_last_for_pamelding ? "Åpne påmelding" : "Steng påmelding"}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {!lasterFellestur && !valgtData && (
                <p>Velg en fellestur for å låse påmelding.</p>
            )}
        </div>
    );
}

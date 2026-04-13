import { useState } from "react";
import { useFellestur } from "../../../hooks/useFellesturer";
import { usePåmelding } from "../../../hooks/usePåmelding";
import { useAutentisering } from "../../../hooks/useAutentisering";
import { useModal } from "../../../hooks/useModal";
import FellesturSøk from "../FellesturSøk";
import ConfirmModal from "../../ConfirmModal";
import { DATO_STATUS } from "../../../constants/konstanter";
import { toast } from 'react-toastify';
import '../lås-dato/LåsDato.css';

//Låser påmelding for en fellestur. Laget av Kay
//fellesturer-prop brukes av turleder for å begrense søk til egne turer
export default function LåsFellestur({fellesturer: fellesturer_prop} = {}) {
    const { token } = useAutentisering({ autoFetch: false });
    const { fellesturer: fellesturer_alle, hentFellesturFraId } = useFellestur({ autoFetch: !fellesturer_prop });
    const { låsPåmelding } = usePåmelding({ token });
    const [valgtData, setValgtData] = useState(null);
    const [erLåst, setErLåst] = useState(false);
    const [lasterFellestur, setLasterFellestur] = useState(false);
    const [laster, setLaster] = useState(false);
    const { isOpen: visBekreft, open: åpneBekreft, close: lukkBekreft } = useModal();
    const fellesturer = fellesturer_prop ?? fellesturer_alle;


    const handleSøkSelect = async (id) => {
        if (!id) {
            setValgtData(null);
            setErLåst(false);
            return;
        }
        setLasterFellestur(true);
        try {
            const data = await hentFellesturFraId(id);
            setValgtData(data);
            setErLåst(data?.datoer[0]?.er_last_for_pamelding ?? false);
        } catch (err) {
            toast.error('Kunne ikke hente fellestur: ' + err.message);
            setValgtData(null);
        } finally {
            setLasterFellestur(false);
        }
    };

    const handleLåsFellestur = async () => {
        if (!valgtData) return;
        setLaster(true);
        try {
            await låsPåmelding(valgtData.aktivitet_id, true);
            setErLåst(true);
            toast.success('Påmelding låst');
        } catch (err) {
            toast.error('Kunne ikke låse: ' + err.message);
        } finally {
            setLaster(false);
        }
    };

    return (
        <div className="fellestur-form-container">
            <h2>Lås fellestur</h2>

            <FellesturSøk
                fellesturer={fellesturer}
                onSelect={handleSøkSelect}
                lagretTittel={valgtData?.aktivitet_tittel ?? ""}
            />

            {/*Startdato må være valgt før bruker kan låse fellestur*/}
            {!lasterFellestur && valgtData && (
                <>
                    <p>
                        <strong>Fellestur:</strong> {valgtData.aktivitet_tittel}
                    </p>
                    {valgtData.datoer?.some(d => d.aktivitet_dato_status === DATO_STATUS.FORESLATT) ? (
                        <p>Du må låse en startdato før du kan låse påmelding.</p>
                    ) : erLåst ? (
                        <p><strong>Status:</strong> Påmelding stengt</p>
                    ) : (
                        <button
                            type="button"
                            onClick={åpneBekreft}
                            disabled={laster}
                        >
                            Steng påmelding
                        </button>
                    )}
                </>
            )}

            {!lasterFellestur && !valgtData && (
                <p>Velg en fellestur for å låse påmelding</p>
            )}

            <ConfirmModal
                show={visBekreft}
                onClose={lukkBekreft}
                onConfirm={() => { lukkBekreft(); handleLåsFellestur(); }}
                tittel="Steng påmelding"
                melding={`Er du sikker på at du vil stenge påmelding for "${valgtData?.aktivitet_tittel}"?`}
                confirmTekst="Steng"
                knappFarge="blå"
            />
        </div>
    );
}
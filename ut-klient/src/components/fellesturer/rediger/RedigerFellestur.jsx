import { useState } from "react";
import { useFellestur } from "../../../hooks/useFellesturer";
import FellesturForm from "../fellestur-form/FellesturForm";
import FellesturSøk from "../FellesturSøk";
import { toast } from 'react-toastify';

//Redigerer en eksisterende Fellestur ved først å søke den opp. Laget av Kay
export default function RedigerFellestur() {
    const {fellestur, hentFellesturFraId, redigerFellestur} = useFellestur({autoFetch: true});
    const [valgtData, setValgtData] = useState(null);
    const [lasterFellestur, setLasterFellestur] = useState(false);

    const handleSøkSelect = async (id) => {
        if (!id) {
            setValgtData(null);
            return;
        }

        setLasterFellestur(true);
        try {
            const data = await hentFellesturFraId(id);
            
            //TODO: må oppdatere denne når jeg får testdata fra DB.
            const formatertData = {
                ...data,
                datoer: data.datoer ? data.datoer.map(d => new Date(d)) : []
            };
            
            setValgtData(formatertData);
        } catch (err) {
            toast.error("Kunne ikke hente fellestur: " + err.message);
            setValgtData(null);
        } finally {
            setLasterFellestur(false);
        }
    };

    const handleOppdatering = async (formData) => {
        try {
            await redigerFellestur(valgtData.fellestur_id, formData);
            toast.success("Fellesturen ble oppdatert!");
            setValgtData(null); 

        } catch (err) {
            toast.error("Feil ved oppdatering: " + err.message);
        }
    };

    return (
        <div className="fellestur-form-container">
            <h2>Rediger Fellestur</h2>
            
            {/*Søkefelt til fellestur*/}
            <FellesturSøk 
                fellesturer={fellestur} 
                onSelect={handleSøkSelect} 
                lagretTittel={valgtData?.tittel || ""}
            />

            {/*Viser FellesturFom når bruker har valgt fellestur*/}
            {!lasterFellestur && valgtData ? (
                <FellesturForm 
                    lagretData={valgtData} 
                    onSubmitAction={handleOppdatering} 
                    buttonText="Lagre endringer" 
                />
            ) : (
                <p style={{color: "#888"}}>Velg fellestur for å begynne redigering.</p>
            )}
        </div>
    );
}
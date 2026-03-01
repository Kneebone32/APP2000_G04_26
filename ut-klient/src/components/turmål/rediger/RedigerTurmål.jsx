import { useState } from "react";
import { useTurmål } from "../../../hooks/useTurmål";
import TurmålForm from "../turmål-form/TurmålForm";
import TurmålSøk from "../TurmålSøk";
import { toast } from 'react-toastify';

//Redigerer ett eksisterende Turmål ved først å søke den opp. Laget av Kay
export default function RedigerTurmål() {
    const {turmål, hentTurmålFraId, redigerTurmål} = useTurmål(true);
    const [valgtData, setValgtData] = useState(null);
    const [lasterTurmål, setLasterTurmål] = useState(false);

    const handleSøkSelect = async (id) => {
        if (!id) {
            setValgtData(null);
            return;
        }

        setLasterTurmål(true);
        try {
            const data = await hentTurmålFraId(id);
            
            //TODO: må oppdatere denne når jeg får testdata fra DB.
            
            setValgtData(data);
        } catch (err) {
            toast.error("Kunne ikke hente turmål: " + err.message);
            setValgtData(null);
        } finally {
            setLasterTurmål(false);
        }
    };

    const handleOppdatering = async (formData) => {
        try {
            await redigerTurmål(valgtData.turmål_id, formData);
            toast.success("Turmålet ble oppdatert!");
            setValgtData(null); 

        } catch (err) {
            toast.error("Feil ved oppdatering: " + err.message);
        }
    };

    return (
        <div className="turmål-form-container">
            <h2>Rediger Turmål</h2>
            
            {/*Søkefelt til turmål*/}
            <TurmålSøk 
                turmål={turmål} 
                onSelect={handleSøkSelect} 
                lagretTittel={valgtData?.tittel || ""}
            />

            {/*Viser TurmålFom når bruker har valgt turmål*/}
            {!lasterTurmål && valgtData ? (
                <TurmålForm 
                    lagretData={valgtData} 
                    onSubmitAction={handleOppdatering} 
                    buttonText="Lagre endringer" 
                />
            ) : (
                <p style={{color: "#888"}}>Velg turmål for å begynne redigering.</p>
            )}
        </div>
    );
}
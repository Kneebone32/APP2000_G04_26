import { useState } from "react";
import { useFellestur } from "../../../hooks/useFellesturer";
import FellesturForm from "../fellestur-form/FellesturForm";
import FellesturSøk from "../FellesturSøk";
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";

//Redigerer en eksisterende Fellestur ved først å søke den opp. Laget av Kay
//fellesturer-prop brukes av turleder for å begrense søk til egne turer
export default function RedigerFellestur({fellesturer: fellesturer_prop} = {}) {
    const { t } = useTranslation();
    const {fellesturer: fellesturer_alle, hentFellesturFraId, redigerFellestur} = useFellestur({autoFetch: !fellesturer_prop});
    const fellestur = fellesturer_prop ?? fellesturer_alle;
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
            setValgtData(data);
        } catch (err) {
            toast.error(t("fellesturer.feil_henting") + err.message);
            setValgtData(null);
        } finally {
            setLasterFellestur(false);
        }
    };

    const handleOppdatering = async (formData) => {
        try {
            console.log(formData);
            await redigerFellestur(valgtData.aktivitet_id, formData);
            toast.success(t("fellesturer.oppdatert"));
            setValgtData(null); 

        } catch (err) {
            toast.error(t("fellesturer.feil_oppdatering") + err.message);
        }
    };

    return (
        <div className="fellestur-form-container">
            <h2>{t("fellesturer.rediger")}</h2>
            
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
                    editModus={true}
                    buttonTekst="Lagre endringer"
                />
            ) : (
                <p style={{color: "#888"}}>{t("fellesturer.velg_fellestur")}</p>
            )}
        </div>
    );
}
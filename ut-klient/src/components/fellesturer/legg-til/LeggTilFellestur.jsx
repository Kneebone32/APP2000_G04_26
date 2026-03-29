import { useFellestur } from "../../../hooks/useFellesturer";
import FellesturForm from "./../fellestur-form/FellesturForm"
import { Slide, toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import { useAutentisering } from "../../../hooks/useAutentisering";

//Oppretter en ny Fellestur. Laget av Kay
export default function LeggTilFellestur() {
    const { t } = useTranslation();
    const { bruker } = useAutentisering({});
    const { opprettFellestur } = useFellestur({})
    
    const handleOpprett = async (formData) => {
        const id = bruker?.bruker_id;
    
        try {
            await opprettFellestur({ ...formData, brukerId: id });
            toast.success("Fellestur opprettet!");

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="fellestur-form-container">
            <h1>{t("fellesturer.legg_til")}</h1>
            <FellesturForm 
                onSubmitAction={handleOpprett} 
                buttonTekst={t("fellesturer.lagre")} 
            />
        </div>
    );
}
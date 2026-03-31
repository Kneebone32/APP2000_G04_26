import { useFellestur } from "../../../hooks/useFellesturer";
import FellesturForm from "./../fellestur-form/FellesturForm"
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import { useAutentisering } from "../../../hooks/useAutentisering";

//Oppretter en ny Fellestur. Laget av Kay
export default function LeggTilFellestur() {
    const { t } = useTranslation();
    const { token } = useAutentisering({autoFetch: true});
    const { opprettFellestur } = useFellestur({token})

    const handleOpprett = async (formData) => {
        try {
            await opprettFellestur(formData);
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
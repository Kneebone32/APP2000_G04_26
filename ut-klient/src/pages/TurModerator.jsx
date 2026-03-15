import LeggTilTur from "../components/turruter/LeggTilTur";
import SlettTur from "../components/turruter/SlettTur";
import RedigerTur from "../components/turruter/RedigerTur";
import { useFetchTurer } from "../hooks/useFetchTurer";
import { useTranslation } from "react-i18next";
import './TurModerator.css';

// Administrasjonsside for å legge til, redigere og slette turruter. Laget av Olai
export default function TurModerator() {
    const { refetch } = useFetchTurer(true);
    const { t } = useTranslation();


    return (
        <div className="TurModeratorPanel">
            <h1>{t("tur.tittel")}</h1>
            
            <LeggTilTur onSuccess={refetch} />

            <hr />

            <RedigerTur onSuccess={refetch} />

            <hr />

            <SlettTur onSuccess={refetch} />


        </div>
    );
}
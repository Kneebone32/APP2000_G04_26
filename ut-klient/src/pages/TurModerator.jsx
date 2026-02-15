import LeggTilTur from "../components/LeggTilTur";
import SlettTur from "../components/SlettTur";
import { useFetchTurer } from "../hooks/useFetchTurer";
import { useTranslation } from "react-i18next";
import './TurModerator.css';

export default function TurModerator() {
    const { refetch } = useFetchTurer(true);
    const { t } = useTranslation();


    return (
        <div className="TurModeratorPanel">
            <h1>{t("tur.tittel")}</h1>
            
            <LeggTilTur onSuccess={refetch} />

            <hr />

            <SlettTur onSuccess={refetch} />


        </div>
    );
}
import LeggTilHytte from "../components/LeggTilHytte";
import SlettHytte from "../components/SlettHytte";
import { useFetchHytter } from "../hooks/useFetchHytter";
import { useTranslation } from "react-i18next";
import './HytteModerator.css';

export default function HytteModerator() {
    const { refetch } = useFetchHytter(true);
    const { t } = useTranslation();


    return (
        <div className="HytteModeratorPanel">
            <h1>{t("admin.tittel")}</h1>
            
            <LeggTilHytte onSuccess={refetch} />

            <hr />

            <SlettHytte onSuccess={refetch} />


        </div>
    );
}
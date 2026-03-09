import LeggTilHytte from "../components/hytter/LeggTilHytte";
import RedigerHytte from "../components/hytter/RedigerHytte";
import SlettHytte from "../components/hytter/SlettHytte";
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

            <RedigerHytte onSuccess={refetch} />
            
            
            <hr />

            <SlettHytte onSuccess={refetch} />


        </div>
    );
}
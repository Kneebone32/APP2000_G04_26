import LeggTilHytte from "../components/LeggTilHytte";
import SlettHytte from "../components/SlettHytte";
import { useFetchHytter } from "../hooks/useFetchHytter";
import { useTranslation } from "react-i18next";
import './Admin.css';

export default function Admin() {
    const { refetch } = useFetchHytter(true);
    const { t } = useTranslation();


    return (
        <div className="AdminPanel">
            <h1>{t("admin.tittel")}</h1>
            
            <LeggTilHytte onSuccess={refetch} />

            <hr />

            <SlettHytte onSuccess={refetch} />


        </div>
    );
}
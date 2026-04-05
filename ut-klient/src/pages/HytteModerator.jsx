import { useState } from "react";
import LeggTilHytte from "../components/hytter/LeggTilHytte";
import RedigerHytte from "../components/hytter/RedigerHytte";
import SlettHytte from "../components/hytter/SlettHytte";
import { useFetchHytter } from "../hooks/useFetchHytter";
import { useTranslation } from "react-i18next";
import { HYTTE_FANER } from "../constants/konstanter";
import './HytteModerator.css';

// Administrasjonsside for å legge til, redigere og slette hytter. Laget av Olai
export default function HytteModerator() {
    const [aktivFane, setAktivFane] = useState("Legg til");
    const { refetch } = useFetchHytter(true);
    const { t } = useTranslation();

    return (
        <div className="HytteModeratorPanel">
            <h1>{t("admin.tittel")}</h1>

            <div className="HytteFaneContainer">
                {HYTTE_FANER.map(fane => (
                    <button
                        key={fane}
                        className={`btn ${aktivFane === fane ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setAktivFane(fane)}
                    >
                        {fane}
                    </button>
                ))}
            </div>

            {aktivFane === "Legg til" && (
                <LeggTilHytte onSuccess={refetch} />
            )}

            {aktivFane === "Rediger" && (
                <RedigerHytte onSuccess={refetch} />
            )}

            {aktivFane === "Slett" && (
                <SlettHytte onSuccess={refetch} />
            )}
        </div>
    );
}

import { useState } from "react";
import LeggTilHytte from "../../components/hytter/LeggTilHytte";
import RedigerHytte from "../../components/hytter/RedigerHytte";
import SlettHytte from "../../components/hytter/SlettHytte";
import { HYTTE_FANER } from "../../constants/konstanter";
import './HytteModerator.css';
import PageWrapper from "../../components/PageWrapper";

// Administrasjonsside for å legge til, redigere og slette hytter. Laget av Olai
export default function HytteModerator({ hytter } = {}) {
    const [aktivFane, setAktivFane] = useState("Legg til");

    return (
        <PageWrapper>
        <div className="HytteModeratorPanel">
            <h1>Hytter</h1>

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
                <LeggTilHytte />
            )}

            {aktivFane === "Rediger" && (
                <RedigerHytte hytter={hytter} />
            )}

            {aktivFane === "Slett" && (
                <SlettHytte hytter={hytter} />
            )}
        </div>
        </PageWrapper>
    );
}
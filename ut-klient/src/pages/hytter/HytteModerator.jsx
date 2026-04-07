import { useState } from "react";
import LeggTilHytte from "../../components/hytter/LeggTilHytte";
import RedigerHytte from "../../components/hytter/RedigerHytte";
import SlettHytte from "../../components/hytter/SlettHytte";
import { useFetchHytter } from "../../hooks/useFetchHytter";
import { useAutentisering } from "../../hooks/useAutentisering";
import { HYTTE_FANER } from "../../constants/konstanter";
import './HytteModerator.css';
import PageWrapper from "../../components/PageWrapper";

// Administrasjonsside for å legge til, redigere og slette hytter. Laget av Olai
export default function HytteModerator() {
    const [aktivFane, setAktivFane] = useState("Legg til");
    const { token } = useAutentisering();
    const { hytter, mineHytteIder, refetch } = useFetchHytter({hytteKort: true, token});

    const mineHytter = hytter.filter(hytte => mineHytteIder.includes(hytte.id));
    console.log(hytter)

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
                <LeggTilHytte onSuccess={refetch} />
            )}

            {aktivFane === "Rediger" && (
                <RedigerHytte hytter={mineHytter} onSuccess={refetch} />
            )}

            {aktivFane === "Slett" && (
                <SlettHytte hytter={mineHytter} onSuccess={refetch} />
            )}
        </div>
        </PageWrapper>
    );
}

import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import HytteKort from "../components/hytter/HytteKort";
import AnnonseKort from "../components/annonse/AnnonseKort";
import { useFetchHytter } from "../hooks/useFetchHytter";
import { useFetchAnnonser } from "../hooks/useFetchAnnonser";
import { useFavoritter } from "../hooks/useFavoritter";
import { useAutentisering } from "../hooks/useAutentisering";
import { useTranslation } from "react-i18next";
import "./Hytter.css";

// Viser oversikt over alle hytter som kort. Laget av Olai.
export default function Hytter() {
  const { hytter, loadingHytter, errorHytter } = useFetchHytter({hytteKort: true});
  const { annonser } = useFetchAnnonser({ annonseKort: true });
  const { token } = useAutentisering();
  const { erHytteFavoritt, toggleHytteFavoritt } = useFavoritter({token});
  const { t } = useTranslation();
  const [søk, setSøk] = useState('');

  // Filtrerer ut godkjente annonser med søkeordet "hytte".
  const hytteAnnonser = annonser.filter(a =>
    a.status === "godkjent" && a.søkeord?.includes("hytte")
  );

  const filtrert = hytter.filter((hytte) => {
    if (!søk.trim()) return true;
    const søkeord = søk.toLowerCase().trim();
    return (
      hytte.navn?.toLowerCase().includes(søkeord) ||
      hytte.fylke_navn?.toLowerCase().includes(søkeord) ||
      hytte.kommune_navn?.toLowerCase().includes(søkeord)
    );
  });

  return (
    <PageWrapper title={t("hytter.tittel")}>
      <div className="mt-3">

        <div className="hytter-søk">
          <input
            type="text"
            placeholder="Søk"
            value={søk}
            onChange={(e) => setSøk(e.target.value)}
          />
        </div>

        {loadingHytter && <p>{t("hytter.laster")}</p>}

        {errorHytter && console.log(`Error: ${errorHytter}`)}

        {!loadingHytter && !errorHytter && filtrert.length === 0 && (
          <p>{t("hytter.ingen_hytter")}</p>
        )}

        {!loadingHytter && !errorHytter && filtrert.length > 0 && (
          <div className="HyttekortContainer">
            {filtrert.map((hytte) => (
              <HytteKort
                key={hytte.id}
                hytteId={hytte.id}
                hytteNavn={hytte.navn}
                pris={hytte.pris}
                sengeplasser={hytte.sengeplasser}
                fylkeId={hytte.fylke_navn}
                kommuneId={hytte.kommune_navn}
                bildeUrl={hytte.hovedbilde_url}
                erFavoritt={erHytteFavoritt(hytte.id)}
                onToggleFavoritt={toggleHytteFavoritt}
              />
            ))}
            {hytteAnnonser.map((annonse) => (
              <AnnonseKort key={`annonse-${annonse.annonse_id}`} annonse={annonse} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

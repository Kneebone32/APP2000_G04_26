import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import TurKort from "../components/turruter/TurKort";
import { useFetchTurer } from "../hooks/useFetchTurer";
import { useFavoritter } from "../hooks/useFavoritter";
import { useAutentisering } from "../hooks/useAutentisering";
import { useTranslation } from "react-i18next";
import "./Turer.css";

//Basert på Hytter.jsx. Laget av Kay og Olai
export default function Turer() {
  const { t } = useTranslation();
  const { turer, loadingTurer, errorTurer } = useFetchTurer({autoFetch: true}); //turKort: true
  const { token } = useAutentisering();
  const { erTurFavoritt, toggleTurFavoritt } = useFavoritter({token});
  const [søk, setSøk] = useState('');

  const filtrert = turer.filter((tur) => {
    if (!søk.trim()) return true;
    const søkeord = søk.toLowerCase().trim();
    return (
      tur.tur_navn?.toLowerCase().includes(søkeord) ||
      tur.stier?.[0]?.fylke_navn?.toLowerCase().includes(søkeord) ||
      tur.stier?.[0]?.kommune_navn?.toLowerCase().includes(søkeord)
    );
  });

  return (
    <PageWrapper title={t("turer.tittel")}>
      <div className="mt-3">

        <div className="turer-søk">
          <input
            type="text"
            placeholder="Søk"
            value={søk}
            onChange={(e) => setSøk(e.target.value)}
            aria-label="Søk etter turer"
          />
        </div>

        {loadingTurer && <p>{t("turer.laster")}</p>}

        {errorTurer && console.log(`Error: ${errorTurer}`)}

        {!loadingTurer && !errorTurer && filtrert.length === 0 && (
          <p>{t("turer.ingen_turer")}</p>
        )}
        {!loadingTurer && !errorTurer && filtrert.length > 0 && (
          <div className="TurKortContainer">
            {filtrert.map((tur) => (
              <TurKort
                key={tur.tur_id}
                turId={tur.tur_id}
                turNavn={tur.tur_navn}
                vanskelighetsgrad={tur.vanskelighetsgrad}
                bildeUrl={tur.bilder[0]?.tur_url}
                turtype={tur.turtype}
                varighet={tur.varighet}
                lat={tur.punkter?.[0]?.[0]}
                lon={tur.punkter?.[0]?.[1]}
                erFavoritt={erTurFavoritt(tur.tur_id)}
                onToggleFavoritt={toggleTurFavoritt}
              />
              ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

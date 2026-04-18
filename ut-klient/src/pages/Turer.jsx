import { useState, useMemo } from "react";
import PageWrapper from "../components/PageWrapper";
import TurKort from "../components/turruter/TurKort";
import AnnonseKort from "../components/annonse/AnnonseKort";
import { useFetchTurer } from "../hooks/useFetchTurer";
import { useFetchAnnonser } from "../hooks/useFetchAnnonser";
import { useFavoritter } from "../hooks/useFavoritter";
import { useAutentisering } from "../hooks/useAutentisering";
import { useTranslation } from "react-i18next";
import "./Turer.css";

//Basert på Hytter.jsx. Laget av Kay og Olai
export default function Turer() {
  const { t } = useTranslation();
  const { turer, loadingTurer, errorTurer } = useFetchTurer({autoFetch: true}); //turKort: true
  const { annonser } = useFetchAnnonser({ autoFetch: true });
  const { token } = useAutentisering();
  const { erTurFavoritt, toggleTurFavoritt } = useFavoritter({token});
  const [søk, setSøk] = useState('');

  const iDag = new Date();
  const turAnnonser = annonser.filter(a =>
    a.status !== "avvist" &&
    a.sokeord?.includes("turer") &&
    new Date(a.start_dato) <= iDag &&
    new Date(a.slutt_dato) >= iDag
  );

  const filtrert = turer.filter((tur) => {
    if (!søk.trim()) return true;
    const søkeord = søk.toLowerCase().trim();
    return (
      tur.tur_navn?.toLowerCase().includes(søkeord) ||
      tur.stier?.[0]?.fylke_navn?.toLowerCase().includes(søkeord) ||
      tur.stier?.[0]?.kommune_navn?.toLowerCase().includes(søkeord)
    );
  });

  // Blander annonser inn på tilfeldige posisjoner blant turkortene.
  const blandaListe = useMemo(() => {
    const liste = filtrert.map(t => ({ type: 'tur', data: t }));
    turAnnonser.forEach(a => {
      const pos = Math.floor(Math.random() * (liste.length + 1));
      liste.splice(pos, 0, { type: 'annonse', data: a });
    });
    return liste;
  }, [filtrert, turAnnonser]);

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
            {blandaListe.map((innslag) =>
              innslag.type === 'annonse' ? (
                <AnnonseKort key={`annonse-${innslag.data.annonse_id}`} annonse={innslag.data} />
              ) : (
                <TurKort
                  key={innslag.data.tur_id}
                  turId={innslag.data.tur_id}
                  turNavn={innslag.data.tur_navn}
                  vanskelighetsgrad={innslag.data.vanskelighetsgrad}
                  bildeUrl={innslag.data.bilder[0]?.tur_url}
                  turtype={innslag.data.turtype}
                  varighet={innslag.data.varighet}
                  lat={innslag.data.punkter?.[0]?.[0]}
                  lon={innslag.data.punkter?.[0]?.[1]}
                  erFavoritt={erTurFavoritt(innslag.data.tur_id)}
                  onToggleFavoritt={toggleTurFavoritt}
                />
              )
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

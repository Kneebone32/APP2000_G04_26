import { useState, useMemo } from "react";
import PageWrapper from "../../components/PageWrapper";
import HytteKort from "../../components/hytter/HytteKort";
import AnnonseKort from "../../components/annonse/AnnonseKort";
import { useFetchHytter } from "../../hooks/useFetchHytter";
import { useFetchAnnonser } from "../../hooks/useFetchAnnonser";
import { useFavoritter } from "../../hooks/useFavoritter";
import { useAutentisering } from "../../hooks/useAutentisering";
import { useTranslation } from "react-i18next";
import { blandInnAnnonser } from "../../utils/blandAnnonser";
import "./Hytter.css";

// Viser oversikt over alle hytter som kort. Laget av Olai.
export default function Hytter() {
  const { hytter, loadingHytter, errorHytter } = useFetchHytter({ hytteKort: true });
  const { annonser } = useFetchAnnonser({ autoFetch: true });
  const { token } = useAutentisering();
  const { erHytteFavoritt, toggleHytteFavoritt } = useFavoritter({ token });
  const { t } = useTranslation();
  const [søk, setSøk] = useState("");

  const iDag = new Date();
  const hytteAnnonser = annonser.filter(
    (a) => a.status !== "avvist" && a.sokeord?.includes("hytte") && new Date(a.start_dato) <= iDag && new Date(a.slutt_dato) >= iDag,
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

  const blandaListe = useMemo(() => blandInnAnnonser(filtrert, hytteAnnonser, "hytte"), [filtrert, hytteAnnonser]);

  return (
    <PageWrapper title={t("hytter.tittel")}>
      <div className="mt-3">
        <div className="hytter-søk">
          <input type="text" placeholder="Søk" value={søk} onChange={(e) => setSøk(e.target.value)} aria-label="Søk etter hytter" />
        </div>

        {loadingHytter && <p>{t("hytter.laster")}</p>}

        {errorHytter && console.log(`Error: ${errorHytter}`)}

        {!loadingHytter && !errorHytter && filtrert.length === 0 && <p>{t("hytter.ingen_hytter")}</p>}

        {!loadingHytter && !errorHytter && filtrert.length > 0 && (
          <div className="HyttekortContainer">
            {blandaListe.map((innslag) =>
              innslag.type === "annonse" ? (
                <AnnonseKort key={`annonse-${innslag.data.annonse_id}`} annonse={innslag.data} />
              ) : (
                <HytteKort
                  key={innslag.data.id}
                  hytteId={innslag.data.id}
                  hytteNavn={innslag.data.navn}
                  pris={innslag.data.pris}
                  sengeplasser={innslag.data.sengeplasser}
                  fylkeId={innslag.data.fylke_navn}
                  kommuneId={innslag.data.kommune_navn}
                  bildeUrl={innslag.data.hovedbilde_url}
                  erFavoritt={erHytteFavoritt(innslag.data.id)}
                  onToggleFavoritt={toggleHytteFavoritt}
                />
              ),
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

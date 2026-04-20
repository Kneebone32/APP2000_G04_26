import { useState, useMemo } from "react";
import PageWrapper from "../../components/PageWrapper";
import FellesturKort from "../../components/fellesturer/FellesturKort";
import AnnonseKort from "../../components/annonse/AnnonseKort";
import { useFellestur } from "../../hooks/useFellesturer";
import { useFetchAnnonser } from "../../hooks/useFetchAnnonser";
import { useTranslation } from "react-i18next";
import { blandInnAnnonser } from "../../utils/blandAnnonser";
import "./Fellesturer.css";

//Basert på Hytter.jsx. Laget av Kay og Olai
export default function Fellesturer() {
  const { t } = useTranslation();
  const { fellesturer, loadingFellesturer, errorFellesturer } = useFellestur({ autoFetch: true });
  const { annonser } = useFetchAnnonser({ autoFetch: true });
  const [søk, setSøk] = useState("");

  const iDag = new Date();
  const fellesturAnnonser = annonser.filter(
    (a) => a.status !== "avvist" && a.sokeord?.includes("fellestur") && new Date(a.start_dato) <= iDag && new Date(a.slutt_dato) >= iDag,
  );

  const filtrert = fellesturer.filter((fellestur) => {
    if (!søk.trim()) return true;
    const søkeord = søk.toLowerCase().trim();
    return (
      fellestur.aktivitet_tittel?.toLowerCase().includes(søkeord) ||
      fellestur.stier?.[0]?.fylke_navn?.toLowerCase().includes(søkeord) ||
      fellestur.stier?.[0]?.kommune_navn?.toLowerCase().includes(søkeord)
    );
  });

  const blandaListe = useMemo(() => blandInnAnnonser(filtrert, fellesturAnnonser, "fellestur"), [filtrert, fellesturAnnonser]);

  return (
    <PageWrapper title={t("fellesturer.tittel")}>
      <div className="mt-3">
        <div className="fellesturer-søk">
          <input type="text" placeholder="Søk" value={søk} onChange={(e) => setSøk(e.target.value)} aria-label="Søk etter fellesturer" />
        </div>

        {loadingFellesturer && <p>{t("fellesturer.laster")}</p>}

        {errorFellesturer && console.log(`Error: ${errorFellesturer}`)}

        {!loadingFellesturer && !errorFellesturer && filtrert.length === 0 && <p>{t("fellesturer.ingen_turer")}</p>}
        {!loadingFellesturer && !errorFellesturer && filtrert.length > 0 && (
          <div className="FellesturKortContainer">
            {blandaListe.map((innslag) =>
              innslag.type === "annonse" ? (
                <AnnonseKort key={`annonse-${innslag.data.annonse_id}`} annonse={innslag.data} />
              ) : (
                <FellesturKort
                  key={innslag.data.aktivitet_id}
                  fellesturId={innslag.data.aktivitet_id}
                  fellesturNavn={innslag.data.aktivitet_tittel}
                  dato={innslag.data.datoer}
                  bildeUrl={innslag.data.bilder[0]?.aktivitet_url}
                />
              ),
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

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

  // Filtrerer ut godkjente annonser med søkeordet "hytte".
  const hytteAnnonser = annonser.filter(a =>
    a.status === "godkjent" && a.søkeord?.includes("hytte")
  );

  return (
    <PageWrapper title={t("hytter.tittel")}>
      <div className="mt-3">
        {loadingHytter && <p>{t("hytter.laster")}</p>}

        {errorHytter && console.log(`Error: ${errorHytter}`)}

        {!loadingHytter && !errorHytter && hytter.length === 0 && (
          <p>{t("hytter.ingen_hytter")}</p>
        )}

        {!loadingHytter && !errorHytter && hytter.length > 0 && (
          <div className="HyttekortContainer">
            {hytter.map((hytte) => (
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

import PageWrapper from "../components/PageWrapper";
import AnnonseKort from "../components/annonse/AnnonseKort";
import { useFetchAnnonser } from "../hooks/useFetchAnnonser";
import { useTranslation } from "react-i18next";
import "./Annonser.css";

// Viser oversikt over alle annonser som kort. Laget av Olai.
export default function Annonser() {
  const { annonser, loadingAnnonser, errorAnnonser } = useFetchAnnonser({ autoFetch: true });
  const { t } = useTranslation();

  return (
    <PageWrapper title={t("sider.annonser")}>
      <div className="mt-3">
        {loadingAnnonser && <p>Laster annonser...</p>}

        {errorAnnonser && console.log(`Error: ${errorAnnonser}`)}

        {!loadingAnnonser && !errorAnnonser && annonser.length === 0 && (
          <p>Ingen annonser funnet.</p>
        )}

        {!loadingAnnonser && !errorAnnonser && annonser.length > 0 && (
          <div className="AnnonsekortContainer">
            {annonser.map((annonse) => (
              <AnnonseKort 
              key={annonse.id || annonse.annonse_id} 
              annonse={annonse} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
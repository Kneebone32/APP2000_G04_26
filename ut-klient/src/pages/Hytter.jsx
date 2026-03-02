import PageWrapper from "../components/PageWrapper";
import HytteKort from "../components/hytter/HytteKort";
import { useFetchHytter } from "../hooks/useFetchHytter";
import { useTranslation } from "react-i18next";
import "./Hytter.css";

export default function Hytter() {
  const { hytter, loadingHytter, errorHytter } = useFetchHytter(true);
  const { t } = useTranslation();

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
                key={hytte.hytte_id}
                hytteId={hytte.hytte_id}
                hytteNavn={hytte.hytte_navn}
                pris={hytte.hytte_pris}
                sengeplasser={hytte.hytte_sengeplasser}
                fylkeId={hytte.fylke_id}
                kommuneId={hytte.kommune_id}
                bildeUrl={hytte.hytte_bilde}
              />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

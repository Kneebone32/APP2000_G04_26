import PageWrapper from "../../components/PageWrapper";
import FellesturKort from "../../components/fellesturer/FellesturKort";
import { useFellestur } from "../../hooks/useFellesturer";
import { useTranslation } from "react-i18next";
import "./Fellesturer.css";

//Basert på Hytter.jsx. Laget av Kay og Olai
export default function Fellesturer() {
  const { t } = useTranslation();
  const { fellesturer, loadingFellesturer, errorFellesturer } = useFellestur({autoFetch: true});
  console.log(fellesturer);

  return (
    <PageWrapper title={t("fellesturer.tittel")}>
      <div className="mt-3">

        {loadingFellesturer && <p>{t("fellesturer.laster")}</p>}

        {errorFellesturer && console.log(`Error: ${errorFellesturer}`)}

        {!loadingFellesturer && !errorFellesturer && fellesturer.length === 0 && (
          <p>{t("fellesturer.ingen_turer")}</p>
        )}
        {!loadingFellesturer && !errorFellesturer && fellesturer.length > 0 && (
          <div className="FellesturKortContainer">
            {fellesturer.map((fellestur) => (
              <FellesturKort
                key={fellestur.aktivitet_id}
                fellesturId={fellestur.aktivitet_id}
                fellesturNavn={fellestur.aktivitet_tittel}
                startDato={fellestur.datoer[0].aktivitet_start_dato}
                sluttDato={fellestur.datoer[0].aktivitet_slutt_dato}
                bildeUrl={fellestur.bilder[0].aktivitet_url}
              />
              ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

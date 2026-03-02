import PageWrapper from "../components/PageWrapper";
import TurKort from "../components/turruter/TurKort";
import { useFetchTurer } from "../hooks/useFetchTurer";
import { useTranslation } from "react-i18next";
import "./Turer.css";

//Basert på Hytter.jsx. Laget av Kay og Olai
export default function Turer() {
  const { t } = useTranslation();
  const { turer, loadingTurer, errorTurer } = useFetchTurer({autoFetch: true}); //turKort: true
  console.log(turer)

  return (
    <PageWrapper title={t("turer.tittel")}>
      <div className="mt-3">

        {loadingTurer && <p>{t("turer.laster")}</p>}

        {errorTurer && console.log(`Error: ${errorTurer}`)}

        {!loadingTurer && !errorTurer && turer.length === 0 && (
          <p>{t("turer.ingen_turer")}</p>
        )}
        {!loadingTurer && !errorTurer && turer.length > 0 && (
          <div className="TurKortContainer">
            {turer.map((tur) => (
              <TurKort
                key={tur.turrute_id}
                turId={tur.turrute_id}
                turNavn={tur.turrute_navn}
                vanskelighetsgrad={tur.vanskelighetsgrad}
                bildeUrl={tur.hovedbilde_url}
                turtype={tur.turtype}
                varighet={tur.varighet}
                lat={tur.punkter?.[0]?.[0]}
                lon={tur.punkter?.[0]?.[1]}
              />
              ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

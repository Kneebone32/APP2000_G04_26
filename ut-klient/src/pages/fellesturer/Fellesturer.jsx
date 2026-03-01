import PageWrapper from "../components/PageWrapper";
import FellesturKort from "../../components/fellesturer/FellesturKort";
import { useFellesturer } from "../hooks/useFellesturer";
import { useTranslation } from "react-i18next";
import "./Fellesturer.css";

//Basert på Hytter.jsx. Laget av Kay og Olai
export default function Fellesturer() {
  const { t } = useTranslation();
  const { fellesturer, loadingFellesturer, errorFellesturer } = useFellesturer(true);

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
                key={fellestur.fellesturrute_id}
                fellesturId={fellestur.fellesturrute_id}
                fellesturNavn={fellestur.fellesturrute_navn}
                vanskelighetsgrad={fellestur.vanskelighetsgrad}
                bildeUrl={fellestur.hovedbilde_url}
                fellesturtype={fellestur.fellesturtype}
                varighet={fellestur.varighet}
              />
              ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

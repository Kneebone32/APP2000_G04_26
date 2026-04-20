import { useState } from "react";
import LeggTilTur from "../../components/turruter/LeggTilTur";
import SlettTur from "../../components/turruter/SlettTur";
import RedigerTur from "../../components/turruter/RedigerTur";
import { useFetchTurer } from "../../hooks/useFetchTurer";
import { useTranslation } from "react-i18next";
import PageWrapper from "../../components/PageWrapper";
import { TUR_FANER } from "../../constants/konstanter";
import "./TurModerator.css";

// Administrasjonsside for å legge til, redigere og slette turruter. Laget av Olai
export default function TurModerator() {
  const [aktivFane, setAktivFane] = useState("Legg til");
  const { refetch } = useFetchTurer({});
  const { t } = useTranslation();

  return (
    <PageWrapper>
      <div className="TurModeratorPanel">
        <h1>{t("tur.tittel")}</h1>

        <div className="TurFaneContainer">
          {TUR_FANER.map((fane) => (
            <button
              key={fane}
              className={`btn ${aktivFane === fane ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setAktivFane(fane)}
            >
              {fane}
            </button>
          ))}
        </div>

        {aktivFane === "Legg til" && <LeggTilTur onSuccess={refetch} />}

        {aktivFane === "Rediger" && <RedigerTur onSuccess={refetch} />}

        {aktivFane === "Slett" && <SlettTur onSuccess={refetch} />}
      </div>
    </PageWrapper>
  );
}

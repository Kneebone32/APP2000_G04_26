import { useState } from "react";
import PageWrapper from "../../components/PageWrapper";
import FellesturKort from "../../components/fellesturer/FellesturKort";
import { useFellestur } from "../../hooks/useFellesturer";
import { useTranslation } from "react-i18next";
import "./Fellesturer.css";

//Basert på Hytter.jsx. Laget av Kay og Olai
export default function Fellesturer() {
  const { t } = useTranslation();
  const { fellesturer, loadingFellesturer, errorFellesturer } = useFellestur({autoFetch: true});
  const [søk, setSøk] = useState('');

  const filtrert = fellesturer.filter((fellestur) => {
    if (!søk.trim()) return true;
    const søkeord = søk.toLowerCase().trim();
    return (
      fellestur.aktivitet_tittel?.toLowerCase().includes(søkeord) ||
      fellestur.stier?.[0]?.fylke_navn?.toLowerCase().includes(søkeord) ||
      fellestur.stier?.[0]?.kommune_navn?.toLowerCase().includes(søkeord)
    );
  });

  return (
    <PageWrapper title={t("fellesturer.tittel")}>
      <div className="mt-3">

        <div className="fellesturer-søk">
          <input
            type="text"
            placeholder="Søk"
            value={søk}
            onChange={(e) => setSøk(e.target.value)}
          />
        </div>

        {loadingFellesturer && <p>{t("fellesturer.laster")}</p>}

        {errorFellesturer && console.log(`Error: ${errorFellesturer}`)}

        {!loadingFellesturer && !errorFellesturer && filtrert.length === 0 && (
          <p>{t("fellesturer.ingen_turer")}</p>
        )}
        {!loadingFellesturer && !errorFellesturer && filtrert.length > 0 && (
          <div className="FellesturKortContainer">
            {filtrert.map((fellestur) => (
              <FellesturKort
                key={fellestur.aktivitet_id}
                fellesturId={fellestur.aktivitet_id}
                fellesturNavn={fellestur.aktivitet_tittel}
                dato={fellestur.datoer}
                bildeUrl={fellestur.bilder[0]?.aktivitet_url}
              />
              ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

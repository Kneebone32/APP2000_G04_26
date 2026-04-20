import PageWrapper from "../../../components/PageWrapper";
import FellesturKort from "../../../components/fellesturer/FellesturKort";
import { useMineFellesturer } from "../../../hooks/useMineFellesturer";
import { useAutentisering } from "../../../hooks/useAutentisering";
import { PÅMELDING_STATUS } from "../../../constants/konstanter";
import { useTranslation } from "react-i18next";

//Viser fellesturer der bruker er interessert eller har en bindende påmelding. Laget av Kay
export default function MineFellesturer() {
  const { t } = useTranslation();
  const { token } = useAutentisering({ autoFetch: true });
  const { mineFellesturer, mineFellesturerTurleder, loading, error } = useMineFellesturer({ token });

  const bindende = mineFellesturer.filter((tur) => tur.pamelding_status === PÅMELDING_STATUS.BINDENDE);
  const interessert = mineFellesturer.filter((tur) => tur.pamelding_status === PÅMELDING_STATUS.INTERESSERT);

  return (
    <PageWrapper>
      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          {/*Fellesturer som innlogget bruker har meldt en bindende påmelding for*/}
          <section>
            <h2>{t("mine_fellesturer.påmeldt")}</h2>
            {bindende.length === 0 && <p>{t("mine_fellesturer.ingen_påmeldt")}</p>}
            <div className="FellesturKortContainer">
              {bindende.map((fellestur) => (
                <FellesturKort
                  key={fellestur.pamelding_dato_id}
                  fellesturId={fellestur.aktivitet_id}
                  fellesturNavn={fellestur.aktivitet_navn}
                  bildeUrl={fellestur.bilder?.[0]?.aktivitet_url}
                  startDato={fellestur.pamelding_start_dato}
                  sluttDato={fellestur.pamelding_slutt_dato}
                />
              ))}
            </div>
          </section>

          {/*Fellesturer som innlogget bruker har meldt intresse for*/}
          {interessert.length > 0 && (
            <>
              <hr />
              <section>
                <h2>{t("mine_fellesturer.interessert")}</h2>
                <div className="FellesturKortContainer">
                  {interessert.map((fellestur) => (
                    <FellesturKort
                      key={fellestur.pamelding_dato_id}
                      fellesturId={fellestur.aktivitet_id}
                      fellesturNavn={fellestur.aktivitet_navn}
                      bildeUrl={fellestur.bilder?.[0]?.aktivitet_url}
                      startDato={fellestur.pamelding_start_dato}
                      sluttDato={fellestur.pamelding_slutt_dato}
                    />
                  ))}
                </div>
              </section>
            </>
          )}

          {/*Fellesturer som innlogget turleder har opprettet*/}
          {mineFellesturerTurleder.length > 0 && (
            <>
              <hr />
              <section>
                <h2>{t("mine_fellesturer.mine_turer")}</h2>
                <div className="FellesturKortContainer">
                  {mineFellesturerTurleder.map((fellestur) => (
                    <FellesturKort
                      key={fellestur.aktivitet_id}
                      fellesturId={fellestur.aktivitet_id}
                      fellesturNavn={fellestur.aktivitet_tittel}
                      bildeUrl={fellestur.bilder?.[0]?.aktivitet_url}
                      dato={fellestur.datoer}
                    />
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </PageWrapper>
  );
}

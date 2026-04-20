import { useState, useEffect } from "react";
import { FORESPØRSEL_STATUS } from "../../../constants/konstanter";
import { useFetchAnnonser } from "../../../hooks/useFetchAnnonser";
import { formatNorskdato } from "../../../utils/datoUtils";
import "./OppgaveAnnonseForespørsel.css";
import { useTranslation } from "react-i18next";

//Håndterer admin-varsler for annonseforespørsler. Laget av Kay
export default function OppgaveAnnonseForespørsel({ varsel, loading, onBeslutning }) {
  const { t } = useTranslation();
  const erBehandlet = varsel.status === "behandlet";
  const { hentAnnonseFraId, loadingAnnonser } = useFetchAnnonser();
  const [annonse, setAnnonse] = useState(null);

  useEffect(() => {
    if (!varsel.relatert_id) return;
    hentAnnonseFraId(varsel.relatert_id).then((data) => {
      if (data) setAnnonse(data);
    });
  }, [varsel.relatert_id, hentAnnonseFraId]);

  const annonseVisning = () => {
    if (loadingAnnonser) return <p className="varsel-detaljer-behandlet">{t("varsling.laster")}</p>;
    if (!annonse) return null;

    return (
      <div className="oppgave-annonse-kort">
        {annonse.bilde_url && <img src={annonse.bilde_url} alt={annonse.tittel} className="oppgave-annonse-bilde" />}
        <div className="oppgave-annonse-info">
          <strong>{annonse.tittel}</strong>

          {annonse.beskrivelse && <p>{annonse.beskrivelse}</p>}

          <span className="oppgave-annonse-meta">
            {t("varsling.annonsor")} {annonse.annonse_navn}
          </span>

          {annonse.start_dato && (
            <span className="oppgave-annonse-meta">
              {t("varsling.periode")} {formatNorskdato(new Date(annonse.start_dato))} – {formatNorskdato(new Date(annonse.slutt_dato))}
            </span>
          )}

          {annonse.sokeord?.length > 0 && (
            <div className="oppgave-annonse-sokeord">
              {annonse.sokeord.map((ord) => (
                <span key={ord} className="oppgave-annonse-tag">
                  {ord}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (erBehandlet) {
    return (
      <>
        {annonseVisning()}
        <div className="varsel-detaljer-behandlet">
          {varsel.foresporsel_status === FORESPØRSEL_STATUS.GODKJENT ? t("varsling.annonsen_godkjent") : t("varsling.annonsen_avvist")}
        </div>
      </>
    );
  }

  return (
    <>
      {annonseVisning()}
      <div className="varsel-detaljer-handlinger">
        <button
          className="varsel-knapp varsel-knapp-godta"
          onClick={() => onBeslutning(true, { melding: t("varsling.annonse_godkjent_toast") })}
          disabled={loading}
        >
          {t("varsling.godkjenn")}
        </button>
        <button
          className="varsel-knapp varsel-knapp-avvis"
          onClick={() => onBeslutning(false, { melding: t("varsling.annonse_avvist_toast") })}
          disabled={loading}
        >
          {t("varsling.avvis")}
        </button>
      </div>
    </>
  );
}

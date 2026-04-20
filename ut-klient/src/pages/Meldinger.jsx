import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAutentisering } from "../hooks/useAutentisering";
import { useMeldinger } from "../hooks/useMeldinger";
import SamtaleListe from "../components/meldinger/SamtaleListe";
import MeldingsBoks from "../components/meldinger/MeldingsBoks";
import PageWrapper from "../components/PageWrapper";
import { useTranslation } from "react-i18next";
import "./Meldinger.css";

//Meldingsside. Viser meldinger og lar bruken chatte. Laget av Kay
export default function Meldinger() {
  const { t } = useTranslation();
  const { bruker, token, erAutentisert } = useAutentisering({ autoFetch: true });
  const location = useLocation();
  const [valgtSamtale, setValgtSamtale] = useState(location.state?.samtale ?? null);
  const { meldinger, samtaler, loading, error, hentMeldinger, sendMelding, forlatSamtale, markerSamtaleLest } = useMeldinger({
    token,
    autoFetch: erAutentisert,
    valgtSamtaleId: valgtSamtale?.samtale_id,
  });

  const handleVelgSamtale = (samtale) => {
    setValgtSamtale(samtale);
    markerSamtaleLest(samtale.samtale_id);
  };

  const handleForlatSamtale = async () => {
    if (!valgtSamtale) return;
    await forlatSamtale(valgtSamtale.samtale_id);
    setValgtSamtale(null);
  };

  const handleSend = async (meldingTekst, bildeUrl = null) => {
    if (!valgtSamtale) return;
    await sendMelding(valgtSamtale.samtale_id, meldingTekst, bildeUrl);
    await hentMeldinger(valgtSamtale.samtale_id);
  };

  return (
    <PageWrapper>
      <div className="meldinger-side">
        <div className="meldinger-layout">
          <SamtaleListe samtaler={samtaler} valgtId={valgtSamtale?.samtale_id} onVelg={handleVelgSamtale} />
          <div className="meldinger-chat">
            {valgtSamtale ? (
              <MeldingsBoks
                tittel={valgtSamtale.visningsnavn}
                meldinger={meldinger}
                loading={loading}
                error={error}
                brukerId={bruker?.bruker_id}
                onSend={handleSend}
                antallMedlemmer={valgtSamtale.antall_medlemmer}
                onForlatSamtale={handleForlatSamtale}
                bildesamtykke={valgtSamtale.bilde_samtykke_tillatt}
              />
            ) : (
              <div className="meldinger-ingen-valgt">
                <p>{t("meldinger.velg_samtale")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

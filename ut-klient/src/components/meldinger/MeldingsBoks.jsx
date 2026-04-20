import { useState, useRef, useCallback } from "react";
import { formatMeldingTid } from "../../utils/datoUtils";
import { useFileUpload } from "../../hooks/useFileUpload";
import "./MeldingsBoks.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

//Chat-box for en samtale (PM eller gruppe). Laget av Kay
export default function MeldingsBoks({
  meldinger,
  loading,
  error,
  brukerId,
  onSend,
  tittel,
  antallMedlemmer,
  onForlatSamtale,
  bildesamtykke,
}) {
  const { t } = useTranslation();
  const [innhold, setInnhold] = useState("");
  const [bildeUrl, setBildeUrlRaw] = useState(null);
  const [visOpplasting, setVisOpplasting] = useState(false);
  const [tempUrl, setTempUrl] = useState("");
  const bunnRef = useRef(null);

  //Bildedeling er på for PM. Styrt av bildesamtykke for grupper (3+)
  const bildedeling = antallMedlemmer > 2 ? bildesamtykke : true;

  //bilder i chatten
  const setBildeUrl = useCallback((urls) => {
    if (urls && urls.length > 0) {
      setBildeUrlRaw(urls[0]);
      setVisOpplasting(false);
    }
  }, []);

  useFileUpload(setBildeUrl, visOpplasting);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!innhold.trim() && !bildeUrl) return;
    try {
      await onSend(innhold.trim(), bildeUrl);
      setInnhold("");
      setBildeUrlRaw(null);
    } catch {
      toast.error(t("meldinger.feil_sending"));
    }
  };

  return (
    <div className="meldingsboks">
      {tittel && (
        <div className="meldingsboks-header">
          <h3>{tittel}</h3>
          {antallMedlemmer > 2 && (
            <button className="forlat-gruppe-btn" onClick={onForlatSamtale}>
              {t("meldinger.forlat_gruppe")}
            </button>
          )}
        </div>
      )}

      {/*Meldingsboksen*/}
      <div className="meldingsboks-liste">
        {error && <p className="meldingsboks-feil">{error}</p>}
        {!loading && meldinger.length === 0 && <p className="meldingsboks-status">{t("meldinger.ingen_meldinger")}</p>}

        {/*individuell meldingsboble*/}
        {meldinger.map((melding) => {
          const erMinMelding = melding.fra_bruker === brukerId;
          return (
            <div key={melding.melding_id} className={`melding-boble ${erMinMelding ? "melding-min" : "melding-andres"}`}>
              {!erMinMelding && <span className="melding-avsender">{melding.avsender_navn}</span>}
              {melding.melding_tekst && <p className="melding-innhold">{melding.melding_tekst}</p>}
              {melding.bilde_url && <img src={melding.bilde_url} alt={t("meldinger.bilde")} className="melding-bilde" />}
              <span className="melding-tid">{formatMeldingTid(melding.sendt_datetime)}</span>
            </div>
          );
        })}
        <div ref={bunnRef} />
      </div>

      {/*Bildeopplaster*/}
      {visOpplasting && (
        <div className="melding-opplasting">
          <simple-file-upload
            accept="image/*"
            max-file-size="5242880"
            max-files="1"
            public-key={import.meta.env.VITE_SFU_PUBLIC_KEY}
          ></simple-file-upload>

          {/*temp bildeopplastning uten SFU*/}
          <div className="melding-url-input">
            <input
              type="text"
              placeholder={t("meldinger.bilde_url")}
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              disabled={!bildedeling}
            />

            <button
              type="button"
              onClick={() => {
                if (tempUrl.trim()) {
                  setBildeUrlRaw(tempUrl.trim());
                  setTempUrl("");
                  setVisOpplasting(false);
                }
              }}
              disabled={!bildedeling}
            >
              {t("meldinger.legg_til")}
            </button>
          </div>
        </div>
      )}

      {/*Forhåndsvisning av valgt bilde*/}
      {bildeUrl && (
        <div className="melding-bilde-preview">
          <img src={`${bildeUrl}?w=80&h=80&fit=fit`} alt="forhånsvisning" />
          <button type="button" onClick={() => setBildeUrlRaw(null)}>
            ✕
          </button>
        </div>
      )}

      {/*Form for å sende melding*/}
      <form className="meldingsboks-input" onSubmit={handleSend}>
        <input
          type="text"
          value={innhold}
          onChange={(e) => setInnhold(e.target.value)}
          placeholder={t("meldinger.skriv_melding")}
          aria-label={t("meldinger.skriv_melding")}
        />

        <button
          type="button"
          className="bilde-btn"
          onClick={() => setVisOpplasting((vis) => !vis)}
          title={bildedeling ? t("meldinger.last_opp_bilde") : t("meldinger.bildedeling_deaktivert")}
          disabled={!bildedeling}
        >
          {t("meldinger.bilde")}
        </button>
        <button type="submit" disabled={!innhold.trim() && !bildeUrl}>
          {t("meldinger.send")}
        </button>
      </form>
    </div>
  );
}

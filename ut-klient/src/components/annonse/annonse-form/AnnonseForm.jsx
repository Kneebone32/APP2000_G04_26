import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useFileUpload } from "../../../hooks/useFileUpload";
import TempBilde from "../../TempBilde";
import SøkeordDropdown from "../SøkeordDropdown";
import "./AnnonseForm.css";

const SØKEORD_VALG = ["hytte", "turer", "turmaal", "fellestur"];

// Delt skjema for LeggTilAnnonse og RedigerAnnonse. Laget av Olai.
export default function AnnonseForm({ lagretData = {}, onSubmitAction, buttonTekst }) {
  const { t } = useTranslation();
  const uploaderRef = useRef(null);
  const søkeordValg = SØKEORD_VALG;

  const [annonserNavn, setAnnonserNavn] = useState(lagretData.annonse_navn || "");
  const [tittel, setTittel] = useState(lagretData.tittel || "");
  const [beskrivelse, setBeskrivelse] = useState(lagretData.beskrivelse || lagretData.tekst || "");
  const [bildeUrl, setBildeUrl] = useState(lagretData.bilde_url || "");
  const [tempUrl, setTempUrl] = useState("");
  const [søkeord, setSøkeord] = useState(lagretData.sokeord || lagretData.søkeord || []);
  const [startDato, setStartDato] = useState(lagretData.start_dato ? lagretData.start_dato.slice(0, 10) : "");
  const [sluttDato, setSluttDato] = useState(lagretData.slutt_dato ? lagretData.slutt_dato.slice(0, 10) : "");

  // useFileUpload gir tilbake en array - vi tar bare første URL som string.
  useFileUpload((urls) => {
    if (Array.isArray(urls) && urls.length > 0) setBildeUrl(urls[0]);
  });

  // Legger til eller fjerner et søkeord fra listen.
  const handleToggleSøkeord = (ord) => {
    setSøkeord((prev) => (prev.includes(ord) ? prev.filter((s) => s !== ord) : [...prev, ord]));
  };

  // Legger til en midlertidig bilde-URL manuelt. Laget av Kay.
  const handleLeggTilBilde = (e) => {
    e.preventDefault();
    if (tempUrl.trim() !== "") {
      setBildeUrl(tempUrl.trim());
      setTempUrl("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!annonserNavn.trim() || !/^[A-Za-zØÆÅøæå\s]{3,20}$/.test(annonserNavn.trim())) { toast.error(t("annonse.feil_navn")); return; }
    if (!tittel.trim() || !/^[A-Za-zØÆÅøæå\s]{3,40}$/.test(tittel.trim())) { toast.error(t("annonse.feil_tittel")); return; }
    if (!beskrivelse.trim() || beskrivelse.trim().length < 20) { toast.error(t("annonse.feil_beskrivelse")); return; }
    if (!startDato) { toast.error(t("annonse.feil_startdato")); return; }
    if (!sluttDato) { toast.error(t("annonse.feil_sluttdato")); return; }

    if (new Date(sluttDato) < new Date(startDato)) {
      toast.error(t("annonse.sluttdato_feil"));
      return;
    }

    onSubmitAction({
      annonse_navn: annonserNavn.trim(),
      tittel: tittel.trim(),
      beskrivelse: beskrivelse.trim(),
      bilde_url: bildeUrl,
      sokeord: søkeord,
      start_dato: startDato || null,
      slutt_dato: sluttDato || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="annonse-form" noValidate>
      <div className="input-container">
        <label className="input" htmlFor="annonse-navn">
          {t("felles.navn")}:
          <input
            type="text"
            id="annonse-navn"
            value={annonserNavn}
            onChange={(e) => setAnnonserNavn(e.target.value)}
            pattern="^[A-Za-zØÆÅøæå\s]{3,20}$"
            required
          />
        </label>
      </div>

      <div className="input-container">
        <label className="input" htmlFor="annonse-tittel">
          {t("felles.tittel")}:
          <input
            type="text"
            id="annonse-tittel"
            value={tittel}
            onChange={(e) => setTittel(e.target.value)}
            pattern="^[A-Za-zØÆÅøæå\s]{3,40}$"
            required
          />
        </label>
      </div>

      <div className="input-container">
        <label className="input">
          {t("fellestur_form.beskrivelse")}
          <textarea
            className="AnnonseFormTekstomrade"
            rows="5"
            minLength="20"
            maxLength="1000"
            value={beskrivelse}
            onChange={(e) => setBeskrivelse(e.target.value)}
            required
          />
          <small className={beskrivelse.length > 950 ? "AnnonseFormTegnteller--advarsel" : "AnnonseFormTegnteller"}>
            {beskrivelse.length} / 1000
          </small>
        </label>
      </div>

      <div className="input-container">
        <SøkeordDropdown overskrift={t("annonse.søkeord")} alleValg={søkeordValg} valgteOrd={søkeord} onToggle={handleToggleSøkeord} />
      </div>

      <div className="input-container">
        <label className="input" htmlFor="annonse-start">
          {t("annonse.startdato")}
          <input type="date" id="annonse-start" value={startDato} onChange={(e) => setStartDato(e.target.value)} required />
        </label>
      </div>

      <div className="input-container">
        <label className="input" htmlFor="annonse-slutt">
          {t("annonse.sluttdato")}
          <input type="date" id="annonse-slutt" value={sluttDato} onChange={(e) => setSluttDato(e.target.value)} required />
        </label>
      </div>

      <div className="input-container">
        <label className="input">{t("hytter.last_opp_bilde")}:</label>
        <simple-file-upload
          accept="image/*"
          max-file-size="5242880"
          max-files="1"
          ref={uploaderRef}
          public-key={import.meta.env.VITE_SFU_PUBLIC_KEY}
        ></simple-file-upload>
        {bildeUrl && (
          <div className="AnnonseFormBildeForhandsvisning">
            <p>{t("hytter.bilde_lastet_opp")}</p>
            <img
              src={bildeUrl.includes("simplefileupload") ? `${bildeUrl}?w=200&h=200&fit=fit` : bildeUrl}
              alt="Forhåndsvisning"
              className="AnnonseFormBilde"
            />
          </div>
        )}
        <TempBilde tempUrl={tempUrl} setTempUrl={setTempUrl} onLeggTil={handleLeggTilBilde} />
      </div>

      <button type="submit" className="lagre-btn btn btn-primary">
        {buttonTekst || "Lagre"}
      </button>
    </form>
  );
}

import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useEnums } from "../../../hooks/useEnums";
import { useFileUpload } from "../../../hooks/useFileUpload";
import TempBilde from "../../TempBilde";
import SøkeordDropdown from "../SøkeordDropdown";
import "./AnnonseForm.css";

// Delt skjema for LeggTilAnnonse og RedigerAnnonse. Laget av Olai.
export default function AnnonseForm({ lagretData = {}, onSubmitAction, buttonTekst }) {
  const { t } = useTranslation();
  const uploaderRef = useRef(null);
  const { enumData: søkeordValg } = useEnums("annonse_søkeord_enum");

  const [annonserNavn, setAnnonserNavn] = useState(lagretData.annonserNavn || "");
  const [tittel, setTittel] = useState(lagretData.tittel || "");
  const [beskrivelse, setBeskrivelse] = useState(lagretData.beskrivelse || lagretData.tekst || "");
  const [bildeUrl, setBildeUrl] = useState(lagretData.bilder || []);
  const [tempUrl, setTempUrl] = useState("");
  const [søkeord, setSøkeord] = useState(lagretData.søkeord || []);
  const [startDato, setStartDato] = useState(lagretData.startDato ? lagretData.startDato.slice(0, 10) : "");
  const [sluttDato, setSluttDato] = useState(lagretData.sluttDato ? lagretData.sluttDato.slice(0, 10) : "");

  useFileUpload(setBildeUrl);

  // Legger til eller fjerner et søkeord fra listen.
  const handleToggleSøkeord = (ord) => {
    setSøkeord(prev =>
      prev.includes(ord) ? prev.filter(s => s !== ord) : [...prev, ord]
    );
  };

  // Legger til en midlertidig bilde-URL manuelt i bilde-listen. Laget av Kay.
  const handleLeggTilBilde = (e) => {
    e.preventDefault();
    if (tempUrl.trim() !== "") {
      setBildeUrl([...bildeUrl, tempUrl]);
      setTempUrl("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!annonserNavn.trim() || !tittel.trim() || !beskrivelse.trim()) {
      alert("Vennligst fyll ut alle påkrevde felt");
      return;
    }

    if (startDato && sluttDato && new Date(sluttDato) < new Date(startDato)) {
      alert("Sluttdato kan ikke være før startdato");
      return;
    }

    onSubmitAction({
      annonserNavn: annonserNavn.trim(),
      tittel: tittel.trim(),
      beskrivelse: beskrivelse.trim(),
      bildeUrl: bildeUrl,
      søkeord: søkeord,
      startDato: startDato || null,
      sluttDato: sluttDato || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="d-grid gap-2">
      <div>
        <label htmlFor="annonse-navn">{t("felles.navn")}:</label>
        <input
          type="text"
          id="annonse-navn"
          value={annonserNavn}
          onChange={(e) => setAnnonserNavn(e.target.value)}
          pattern="^[A-Za-zØÆÅøæå\s]{3,20}$"
          required
        />
      </div>

      <div>
        <label htmlFor="annonse-tittel">{t("felles.tittel")}:</label>
        <input
          type="text"
          id="annonse-tittel"
          value={tittel}
          onChange={(e) => setTittel(e.target.value)}
          pattern="^[A-Za-zØÆÅøæå\s]{3,20}$"
          required
        />
      </div>

      <div className="input-container">
        <label className="input">{t("fellestur_form.beskrivelse")}
          <textarea
            className="AnnonseFormTekstomrade"
            rows="5" minLength="20" maxLength="1000"
            value={beskrivelse}
            onChange={(e) => setBeskrivelse(e.target.value)}
            required
          />
          <small className={beskrivelse.length > 950 ? 'AnnonseFormTegnteller--advarsel' : 'AnnonseFormTegnteller'}>
            {beskrivelse.length} / 1000
          </small>
        </label>
      </div>

      <div>
        <SøkeordDropdown
          overskrift="Søkeord"
          alleValg={søkeordValg}
          valgteOrd={søkeord}
          onToggle={handleToggleSøkeord}
        />
      </div>

      <div>
        <label htmlFor="annonse-start">Startdato:</label>
        <input
          type="date"
          id="annonse-start"
          value={startDato}
          onChange={(e) => setStartDato(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="annonse-slutt">Sluttdato:</label>
        <input
          type="date"
          id="annonse-slutt"
          value={sluttDato}
          onChange={(e) => setSluttDato(e.target.value)}
          required
        />
      </div>

      <div>
        <label>{t("hytter.last_opp_bilde")}:</label>
        <simple-file-upload
          accept="image/*"
          max-file-size="5242880"
          max-files="5"
          ref={uploaderRef}
          public-key={import.meta.env.VITE_SFU_PUBLIC_KEY}
        ></simple-file-upload>
        {bildeUrl.length > 0 && (
          <div className="AnnonseFormBildeForhandsvisning">
            <p>{t("hytter.bilde_lastet_opp")} ({bildeUrl.length})</p>
            {bildeUrl.map((url, index) => (
              <img
                key={index}
                src={url.includes("simplefileupload") ? `${url}?w=200&h=200&fit=fit` : url}
                alt={`Preview ${index + 1}`}
                className="AnnonseFormBilde"
              />
            ))}
          </div>
        )}
        <TempBilde tempUrl={tempUrl} setTempUrl={setTempUrl} onLeggTil={handleLeggTilBilde} />
      </div>

      <button type="submit" className="btn btn-primary">
        {buttonTekst || "Lagre"}
      </button>
    </form>
  );
}

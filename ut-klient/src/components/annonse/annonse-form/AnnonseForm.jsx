import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useFileUpload } from "../../../hooks/useFileUpload";
import TempBilde from "../../TempBilde";

// Delt skjema for LeggTilAnnonse og RedigerAnnonse. Laget av Olai.
export default function AnnonseForm({ lagretData = {}, onSubmitAction, buttonTekst }) {
  const { t } = useTranslation();
  const uploaderRef = useRef(null);
  const [annonserNavn, setAnnonserNavn] = useState(lagretData.annonserNavn || "");
  const [tittel, setTittel] = useState(lagretData.tittel || "");
  const [beskrivelse, setBeskrivelse] = useState(lagretData.beskrivelse || lagretData.tekst || "");
  const [bildeUrl, setBildeUrl] = useState(lagretData.bilder || []);
  const [tempUrl, setTempUrl] = useState("");
  const [kategori, setKategori] = useState(lagretData.kategori || "");

  useFileUpload(setBildeUrl);

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

    if (!annonserNavn.trim() || !tittel.trim() || !beskrivelse.trim() || !kategori.trim()) {
      alert("Vennligst fyll ut alle påkrevde felt");
      return;
    }

    onSubmitAction({
      annonserNavn: annonserNavn.trim(),
      tittel: tittel.trim(),
      beskrivelse: beskrivelse.trim(),
      bildeUrl: bildeUrl,
      kategori: kategori.trim(),
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
                    style={{ resize: 'none', width: '100%', maxWidth: '400px' }}
                    rows="5" minLength="20" maxLength="1000"
                    value={beskrivelse}
                    onChange={(e) => setBeskrivelse(e.target.value)}
                    required
                />
                <small style={{ color: beskrivelse.length > 950 ? 'red' : '#666' }}>
                    {beskrivelse.length} / 1000
                </small>
            </label>
        </div>

      <div>
        <label htmlFor="annonse-kategori">{t("felles.kategori")}:</label>
        <input
            type="text"
            id="annonse-kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            pattern="^[A-Za-zØÆÅøæå\s]{3,20}$"
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
                <div style={{ marginTop: '10px' }}>
                    <p>{t("hytter.bilde_lastet_opp")} ({bildeUrl.length})</p>
                    {bildeUrl.map((url, index) => (
                        <img
                            key={index}
                            src={url.includes("simplefileupload") ? `${url}?w=200&h=200&fit=fit` : url}
                            alt={`Preview ${index + 1}`}
                            style={{ marginRight: '10px', maxWidth: '200px', maxHeight: '200px' }}
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

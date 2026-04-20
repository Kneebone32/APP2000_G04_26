import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAutentisering } from "../../hooks/useAutentisering";
import { useFetchHytter } from "../../hooks/useFetchHytter";
import HytteForm from "./hytte-form/HytteForm";

// Lar bruker søke opp en hytte, hente eksisterende data og oppdatere den. Laget av Olai.
export default function RedigerHytte({ onSuccess, hytter: hytter_prop }) {
  const { t } = useTranslation();
  const { token } = useAutentisering({ autoFetch: true });
  const { hytter: hytter_alle, hentHytteFraId, oppdaterHytte } = useFetchHytter({ autoFetch: !hytter_prop, token });
  const hytter = hytter_prop ?? hytter_alle;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lagretData, setLagretData] = useState(null);

  // Filtrerer søkeresultat på hytte-ID eller navn.
  const filteredHytter = hytter.filter(
    (hytte) => hytte.hytte_id?.toString().includes(searchTerm) || hytte.navn?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    if (!selectedId) {
      setLagretData(null);
      return;
    }

    // Henter valgt hytte og mapper API-format til feltene HytteForm forventer.
    const lastHytteData = async () => {
      try {
        setLoading(true);
        setError(null);

        const hytte = await hentHytteFraId(selectedId);

        setLagretData({
          navn: hytte.navn || "",
          beskrivelse: hytte.beskrivelse || "",
          sengeplasser: hytte.hytte_sengeplasser ?? hytte.sengeplasser ?? "",
          pris: hytte.hytte_pris ?? hytte.pris ?? "",
          betjeningsgrad: hytte.betjeningsgrad || "",
          fylke: hytte.fylke || "",
          fylkeId: hytte.fylke_nummer ?? "",
          kommune: hytte.kommune || "",
          kommuneId: hytte.kommune_nummer ?? "",
          koordinat: hytte.koordinater ? [hytte.koordinater.breddegrad, hytte.koordinater.lengdegrad] : null,
          moh: hytte.koordinater?.moh ?? 0,
          fasiliteter: hytte.info_tab && hytte.info_tab.length > 0 ? hytte.info_tab : [],
          bilder: hytte.bilder && hytte.bilder.length > 0 ? hytte.bilder.map((b) => b.url || b) : [],
        });
      } catch (err) {
        setError(t("hytter.feil_henting_melding"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    lastHytteData();
  }, [selectedId]);

  // Sender oppdatert hytte til backend med PUT og nullstiller skjema ved suksess.
  const handleOppdater = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      await oppdaterHytte(selectedId, {
        hytte_id: Number(selectedId),
        hytte_navn: formData.navn,
        hytte_beskrivelse: formData.beskrivelse,
        hytte_sengeplasser: formData.sengeplasser,
        hytte_pris: formData.pris,
        fylke_nummer: formData.fylkeId,
        kommune_nummer: formData.kommuneId,
        hytte_breddegrad: formData.koordinat[0],
        hytte_lengdegrad: formData.koordinat[1],
        hytte_moh: formData.moh,
        hytte_betjeningsgrad: formData.betjeningsgrad,
        info_tab: formData.fasiliteter.length > 0 ? formData.fasiliteter.map((f) => f.id) : null,
        bilder: formData.bilder.length > 0 ? formData.bilder : null,
      });

      alert(t("hytter.hytte_oppdatert"));
      setLagretData(null);
      setSelectedId(null);
      setSearchTerm("");

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error: ", err);
      setError(t("hytter.feil_oppdatering_melding"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{t("hytter.rediger_tittel")}</h2>

      <div>
        <label htmlFor="hytte-search">{t("hytter.søk_og_velg")}:</label>
        <input
          type="text"
          id="hytte-search"
          list="hytter-rediger-list"
          value={searchTerm}
          maxLength={50}
          onChange={(e) => {
            // Velger hytte fra datalist og lagrer ID for videre henting/redigering.
            setSearchTerm(e.target.value);
            const matchedHytte = filteredHytter.find(
              (h) => `ID: ${h.hytte_id} - ${h.navn}` === e.target.value || h.hytte_id?.toString() === e.target.value,
            );
            if (matchedHytte) {
              setSelectedId(matchedHytte.hytte_id.toString());
            } else {
              setSelectedId(null);
            }
          }}
          placeholder={t("hytter.søk_placeholder")}
        />
        <datalist id="hytter-rediger-list">
          {filteredHytter.map((hytte) => (
            <option key={hytte.id} value={`ID: ${hytte.hytte_id} - ${hytte.navn}`} />
          ))}
        </datalist>
      </div>

      {loading && <p>{t("hytter.laster_hyttedata")}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {selectedId && !loading && lagretData && (
        <HytteForm key={selectedId} lagretData={lagretData} onSubmitAction={handleOppdater} buttonTekst={t("hytter.oppdater_knapp")} />
      )}
    </div>
  );
}

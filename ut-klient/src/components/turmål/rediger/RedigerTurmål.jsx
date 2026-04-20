import { useState } from "react";
import { useTurmål } from "../../../hooks/useTurmål";
import TurmålForm from "../turmål-form/TurmålForm";
import TurmålSøk from "../TurmålSøk";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

//Redigerer ett eksisterende Turmål ved først å søke den opp. Laget av Kay
export default function RedigerTurmål() {
  const { t } = useTranslation();
  const { turmål, hentTurmålFraId, redigerTurmål } = useTurmål({ autoFetch: true });
  const [valgtData, setValgtData] = useState(null);
  const [lasterTurmål, setLasterTurmål] = useState(false);

  const handleSøkSelect = async (id) => {
    if (!id) {
      setValgtData(null);
      return;
    }

    setLasterTurmål(true);
    try {
      const data = await hentTurmålFraId(id);
      setValgtData(data);
    } catch (err) {
      toast.error(t("turmål.feil_henting") + err.message);
      setValgtData(null);
    } finally {
      setLasterTurmål(false);
    }
  };

  const handleOppdatering = async (formData) => {
    try {
      await redigerTurmål(valgtData.turmaal_id, formData);
      toast.success(t("turmål.oppdatert"));
      setValgtData(null);
    } catch (err) {
      toast.error(t("turmål.feil_oppdatering") + err.message);
    }
  };

  return (
    <div className="turmål-form-container">
      <h2>{t("turmål.rediger")}</h2>

      {/*Søkefelt til turmål*/}
      <TurmålSøk turmål={turmål} onSelect={handleSøkSelect} lagretTittel={valgtData?.tittel || ""} />

      {/*Viser TurmålFom når bruker har valgt turmål*/}
      {!lasterTurmål && valgtData ? (
        <TurmålForm lagretData={valgtData} onSubmitAction={handleOppdatering} buttonTekst={"Lagre endringer"} />
      ) : (
        <p style={{ color: "#888" }}>{t("turmål.velg_for_redigering")}</p>
      )}
    </div>
  );
}

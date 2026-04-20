import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAutentisering } from "../../hooks/useAutentisering";
import { useArtikkel } from "../../hooks/useArtikkel";
import ArtikkelSøk from "./ArtikkelSøk";
import ArtikkelForm from "./ArtikkelForm";
import { toast } from "react-toastify";
import "../fellesturer/fellestur-form/FellesturForm.css";

//Redigerer en eksisterende artikkel. Laget av Kay
export default function RedigerArtikkel() {
  const { t } = useTranslation();
  const { token } = useAutentisering({ autoFetch: false });
  const { artikler, loading, redigerArtikkel } = useArtikkel({ autoFetch: true, token });

  const [valgtId, setValgtId] = useState(null);
  const [slug, setSlug] = useState("");
  const [tittel, setTittel] = useState("");
  const [innhold, setInnhold] = useState("");

  const handleVelg = (id) => {
    const artikkel = artikler.find((a) => a.artikkel_id === id);
    console.log(artikkel);
    if (!artikkel) {
      setValgtId(null);
      return;
    }
    setValgtId(id);
    setTittel(artikkel.artikkel_tittel);
    setInnhold(artikkel.artikkel_innhold ?? "");
    setSlug(artikkel.artikkel_slug);
  };

  const handleLagre = async () => {
    if (!valgtId) return;
    try {
      await redigerArtikkel(valgtId, { artikkel_tittel: tittel, artikkel_innhold: innhold, artikkel_slug: slug });
      toast.success(t("artikkel.lagret"));
    } catch {
      toast.error(t("artikkel.feil_lagring"));
    }
  };

  return (
    <div className="fellestur-form-container">
      <h2>{t("artikkel.rediger_tittel")}</h2>

      <ArtikkelSøk
        artikler={artikler}
        onSelect={handleVelg}
        lagretTittel={artikler.find((a) => a.artikkel_id === valgtId)?.artikkel_tittel ?? ""}
      />

      {valgtId && (
        <ArtikkelForm
          tittel={tittel}
          onTittelChange={setTittel}
          innhold={innhold}
          onInnholdChange={setInnhold}
          onLagre={handleLagre}
          loading={loading}
          buttonTekst={t("artikkel.lagre_knapp")}
        />
      )}
    </div>
  );
}

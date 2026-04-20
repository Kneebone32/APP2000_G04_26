import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useAutentisering } from "../../hooks/useAutentisering";
import { useFetchAnnonser } from "../../hooks/useFetchAnnonser";
import AnnonseForm from "./annonse-form/AnnonseForm";

// Oppretter en ny annonse. Laget av Olai.
export default function LeggTilAnnonse({ onSuccess }) {
  const { t } = useTranslation();
  const { token } = useAutentisering({ autoFetch: true });
  const { opprettAnnonse, loadingAnnonser: loading } = useFetchAnnonser({ token });

  const handleOpprett = async (formData) => {
    try {
      await opprettAnnonse(formData);
      toast.success(t("annonse.opprettet"));
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(t("annonse.feil_opprettelse") + ": " + err.message);
    }
  };

  return (
    <div>
      <h2>{t("annonse.legg_til_tittel")}</h2>
      <AnnonseForm onSubmitAction={handleOpprett} buttonTekst={loading ? t("felles.lagrer") : t("annonse.legg_til_tittel")} />
    </div>
  );
}

import PageWrapper from "../components/PageWrapper";
import ConfirmModal from "../components/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useModal } from "../hooks/useModal";
import { useAdmin } from "../hooks/useAdmin";
import { useAutentisering } from "../hooks/useAutentisering";
import { toast } from "react-toastify";
import "./Admin.css";

// Hovedside for administrator med navigasjonsknapper til ulike adminseksjoner. Laget av Olai og Kay.
export default function Admin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token } = useAutentisering();
  const { tilbakestillDB, loading } = useAdmin({ token });
  const { isOpen, open, close } = useModal();

  const handleTilbakestill = async () => {
    try {
      await tilbakestillDB();
      close();
      toast.success("Databasen ble tilbakestilt.");
    } catch {
      close();
      toast.error("Tilbakestilling feilet.");
    }
  };

  return (
    <div className="admin-container">
      <PageWrapper title={t("sider.admin")} />
      {/*Hytter*/}
      <button className="AdminKnapp" onClick={() => navigate("/admin/hytter")}>
        {t("admin.gå_til_hytte")}
      </button>
      {/*Turruter*/}
      <button className="AdminKnapp" onClick={() => navigate("/admin/turer")}>
        {t("admin.gå_til_tur")}
      </button>

      <button className="AdminKnapp" onClick={() => navigate("/admin/annonser")}>
        {t("admin.gå_til_annonser")}
      </button>

      {/*Fellesturer*/}
      <button className="AdminKnapp" onClick={() => navigate("/admin/fellesturer")}>
        {t("fellesturer.gå_til_admin")}
      </button>

      {/*Turmål*/}
      <button className="AdminKnapp" onClick={() => navigate("/admin/turmål")}>
        {t("turmål.gå_til_admin")}
      </button>

      {/*Artikler*/}
      <button className="AdminKnapp" onClick={() => navigate("/admin/artikler")}>
        {t("admin.gå_til_artikler")}
      </button>

      {/*Tilbakestill DB*/}
      <button className="AdminKnapp Tilbakestill" onClick={open} disabled={loading}>
        Tilbakestill database
      </button>

      <ConfirmModal
        show={isOpen}
        onClose={close}
        onConfirm={handleTilbakestill}
        tittel="Tilbakestill database"
        melding="Er du sikker? Dette vil tilbakestille hele databasen til backup. Handlingen kan ikke angres."
        confirmTekst={loading ? "Tilbakestiller" : "Tilbakestill"}
      />
    </div>
  );
}

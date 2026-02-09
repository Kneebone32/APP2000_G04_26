import PageWrapper from "../components/PageWrapper";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import './Profil.css';

export default function Profil() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="profil-container">
      <PageWrapper title={t("sider.profil")} />
      <button 
        className="AdminKnapp"
        onClick={() => navigate('/admin')}
      >
        {t("profil.gå_til_admin")}
      </button>
    </div>
  );
}
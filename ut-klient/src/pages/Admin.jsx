import PageWrapper from "../components/PageWrapper";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import './Admin.css';

// Hovedside for administrator med navigasjonsknapper til ulike adminseksjoner. Laget av Olai og Kay.
export default function Admin() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="admin-container">
      <PageWrapper title={t("sider.admin")} />
      {/*Hytter*/} 
      <button 
        className="AdminKnapp"
        onClick={() => navigate('/admin/hytter')}
      >
        {t("admin.gå_til_hytte")}
      </button>
      {/*Turruter*/} 
      <button 
        className="AdminKnapp"
        onClick={() => navigate('/admin/turer')}
        >
        {t("admin.gå_til_tur")}
        </button>

        <button
        className="AdminKnapp"
        onClick={() => navigate('/admin/annonser')}
        >
        {t("admin.gå_til_annonser")}
        </button>

        {/*Fellesturer*/}  
        <button 
        className="AdminKnapp"
        onClick={() => navigate('/admin/fellesturer')}
        >
        {t("fellesturer.gå_til_admin")}
        </button>
                
        {/*Turmål*/}        
        <button 
        className="AdminKnapp"
        onClick={() => navigate('/admin/turmål')}
        >
        {t("turmål.gå_til_admin")}
        </button>
    </div>
  );
}
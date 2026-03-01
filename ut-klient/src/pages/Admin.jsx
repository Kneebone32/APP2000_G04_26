import PageWrapper from "../components/PageWrapper";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import './Admin.css';

export default function Admin() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="admin-container">
      <PageWrapper title={t("sider.admin")} />
      <button 
        className="AdminKnapp"
        onClick={() => navigate('/admin/hytter')}
      >
        {t("admin.gå_til_hytte")}
      </button>
      <button 
        className="AdminKnapp"
        onClick={() => navigate('/admin/turer')}
        >
        {t("admin.gå_til_tur")}
        </button>

        {/*Fellesturer*/}  
        <button 
        className="AdminKnapp"
        onClick={() => navigate('/admin/fellesturer')}
        >
        Gå til Admin Fellesturer
        </button>
                
        {/*Turmål*/}        
        <button 
        className="AdminKnapp"
        onClick={() => navigate('/admin/turmål')}
        >
        Gå til Admin Turmål
        </button>
    </div>
  );
}
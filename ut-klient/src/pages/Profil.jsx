import PageWrapper from "../components/PageWrapper";
import { useNavigate } from "react-router-dom";
import './Profil.css';

export default function Profil() {
  const navigate = useNavigate();

  return (
    <div className="profil-container">
      <PageWrapper title="Nettside for profil" />
      <button 
        className="AdminKnapp"
        onClick={() => navigate('/admin')}
      >
        Gå til Admin Panel
      </button>
    </div>
  );
}
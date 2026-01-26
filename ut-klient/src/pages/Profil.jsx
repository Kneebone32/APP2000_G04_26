import PageWrapper from "../components/PageWrapper";
import { useNavigate } from "react-router-dom";

export default function Profil() {
  const navigate = useNavigate();

  return (
    <div>
      <PageWrapper title="Nettside for profil" />
      <button onClick={() => navigate('/admin')}>
        Gå til Admin Panel
      </button>
    </div>
  );
}
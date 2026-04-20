import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Enkel feilside for 404-feil. Laget av Olai.
const Feilside = () => {
  const { t } = useTranslation();
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center text-center">
      <div>
        <h1 className="display-1 fw-bold">{t("feil.404")}</h1>
        <p className="lead mb-4">{t("feil.side_finnes_ikke")}</p>

        <Link to="/" className="btn btn-success">
          {t("feil.gå_til_forsiden")}
        </Link>
      </div>
    </div>
  );
};

export default Feilside;

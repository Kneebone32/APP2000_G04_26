import "./AnnouncementBar.css";
import { useTranslation } from "react-i18next";

export default function AnnouncementBar() {
  const { t } = useTranslation();
  return (
    <div className="announcement-bar">
      <p className="announcement-text">
        {t("varsling.skoleprosjekt")}
      </p>
    </div>
  );
}

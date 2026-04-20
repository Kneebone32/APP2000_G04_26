import { useTranslation } from "react-i18next";
import "./PageWrapper.css";

export default function PageWrapper({ title, children }) {
  const { t } = useTranslation();
  return (
    <div className="Page">
      <h1 className="Wrapper">{title}</h1>
      {children || <p className="lead">{t("page_wrapper.prototype_innhold")}</p>}
    </div>
  );
}

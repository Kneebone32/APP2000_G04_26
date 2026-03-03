import { useTranslation } from "react-i18next";

export default function TempBilde({ tempUrl, setTempUrl, onLeggTil }) {
    const { t } = useTranslation();
    return (
        <div className="input-container">
            <label className="input">
                {t("test.legg_til_bilde")}
                <div>
                    <input
                        type="text"
                        placeholder={t("test.lim_inn_url")}
                        value={tempUrl}
                        onChange={(e) => setTempUrl(e.target.value)}
                    />
                    <button 
                        type="button" 
                        onClick={onLeggTil} 
                        className="legg-til-btn"
                    >
                        {t("test.legg_til")}
                    </button>
                </div>
            </label>
        </div>
    );
}
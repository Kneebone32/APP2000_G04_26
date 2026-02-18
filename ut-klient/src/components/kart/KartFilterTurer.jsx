import { useState } from "react";
import { useTranslation } from "react-i18next";

//Alle kartfilter til Turer. Hele filen laget av Kay med mindre annet er spesifisert
export default function KartFilterTurer({ filter, setFilter, handleCheckboxChange }) {
  const [turerFilterUtvidet, setTurerFilterUtvidet] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="kart-filter-section">
      <button
        className="filter-toggle-button"
        onClick={() =>
          setTurerFilterUtvidet(!turerFilterUtvidet)
        }
      >
        {turerFilterUtvidet ? "✕" : "☰"} {t("filter.turer")}
      </button>

      {turerFilterUtvidet && (
        <>
          {/*Turer - vis turer*/}
          <div className="turer-kart-toggle">
            <label>
              <input
                type="checkbox"
                checked={filter.visTurer}
                onChange={(e) =>
                  setFilter({ ...filter, visTurer: e.target.checked })
                }
              />{" "}
               {t("filter.vis_turer")}
            </label>
          </div>

          {/*Turer - vanskelighetsgrad - TODO*/}
          <div className="filter-section">
          <label>{t("filter.vanskelighetsgrad")}:</label>
          <select
          value={filter.vanskelighetsgrad}                                             
          onChange={(e) => setFilter({...filter, vanskelighetsgrad: e.target.value})}
          >
            <option value=""disabled selected hidden></option>
          <option value="lett">{t("filter.lett")}</option>
          <option value="middels">{t("filter.middels")}</option>
          <option value="vanskelig">{t("filter.vanskelig")}</option>
          </select>
          </div>

          {/*Turer - Turtype*/}
          <div className="filter-section">
            <label>{t("filter.type")}:</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={filter.turtype.includes("fottur")}
                  onChange={() =>
                    handleCheckboxChange("turtype", "fottur")
                  }
                />{" "}
                {t("filter.fottur")}
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={filter.turtype.includes("sykkeltur")}
                  onChange={() =>
                    handleCheckboxChange("turtype", "sykkeltur")
                  }
                />{" "}
                {t("filter.sykkeltur")}
              </label>
              
              <label>
                <input
                  type="checkbox"
                  checked={filter.turtype.includes("skitur")}
                  onChange={() =>
                    handleCheckboxChange("turtype", "skitur")
                  }
                />{" "}
                {t("filter.skitur")}
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

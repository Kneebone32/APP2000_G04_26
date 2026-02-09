import { useState } from "react";
import { useTranslation } from "react-i18next";

//Alle kartfilter til Turer.
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
          {/*Turer - vis turmål*/}
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
          //value={filters.vanskelighetsgrad}                                             TODO: venter på testdata
          //onChange={(e) => setFilters({...filters, vanskelighetsgrad: e.target.value})} TODO: venter på testdata
          >
          <option value="">{t("filter.lett")}</option>
          <option value="5">{t("filter.middels")}</option>
          <option value="10">{t("filter.vanskelig")}</option>
          </select>
          </div>



          {/*Turer - Varighet - TODO: venter på testdata*/}
          {/*Turer - Turtype*/}
          <div className="filter-section">
            <label>{t("filter.type")}:</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  //checked={filter.turtype.includes("Fottur")}  TODO: venter på testdata
                  onChange={() =>
                    handleCheckboxChange("turtype", "Fottur")
                  }
                />{" "}
                {t("filter.fottur")}
              </label>

              <label>
                <input
                  type="checkbox"
                  //checked={filter.turtype.includes("Sykkeltur")}  TODO: venter på testdata
                  onChange={() =>
                    handleCheckboxChange("turtype", "Sykkeltur")
                  }
                />{" "}
                {t("filter.sykkeltur")}
              </label>
              
              <label>
                <input
                  type="checkbox"
                  //checked={filter.turtype.includes("Skitur")}  TODO: venter på testdata
                  onChange={() =>
                    handleCheckboxChange("turtype", "Skitur")
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

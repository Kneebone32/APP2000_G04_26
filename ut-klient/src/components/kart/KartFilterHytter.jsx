import { useState } from "react";
import { useTranslation } from "react-i18next";

//Alle kartfilter til hytter. Laget av Kay
export default function KartFilterHytter({ filter, setFilter, handleCheckboxChange }) {
  const [hytterFilterUtvidet, setHytterFilterUtvidet] = useState(false);
  const { t } = useTranslation();

  //Laget av AI
  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value);
    if (newMin <= filter.prisnivå[1]) {
      setFilter({ 
        ...filter, 
        prisnivå: [newMin, filter.prisnivå[1]] 
      });
    }
  };

  //Laget av AI
  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value);
    if (newMax >= filter.prisnivå[0]) {
      setFilter({ 
        ...filter, 
        prisnivå: [filter.prisnivå[0], newMax] 
      });
    }
  };

  return (
    <div className="kart-filter-section">
      <button
        className="filter-toggle-button"
        onClick={() => setHytterFilterUtvidet(!hytterFilterUtvidet)}
      >
        {hytterFilterUtvidet ? "✕" : "☰"} {t("filter.hytter")}
      </button>

      {hytterFilterUtvidet && (
        <>
          {/*Hytte - vis hytter*/}
          <div className="hytter-kart-toggle">
            <label>
              <input
                type="checkbox"
                checked={filter.visHytter}
                onChange={(e) =>
                  setFilter({ ...filter, visHytter: e.target.checked })
                }
              />{" "}
              {t("filter.vis_hytter")}
            </label>
          </div>

          {/*Hytte - søkefelt*/}
          <div className="filter-section">
            <label>{t("felles.søk")}:</label>
            <input
              type="text"
              placeholder={t("filter.søk_hytte")}
              value={filter.søkeord}
              onChange={(e) =>
                setFilter({ ...filter, søkeord: e.target.value })
              }
            />
          </div>

          {/*Hytte - prisnivå*/}
          <div className="filter-section">
            <label>{t("filter.prisnivå")}: {filter.prisnivå[0]} kr - {filter.prisnivå[1]} kr</label>
            <div className="range-slider-container">
              <input
                type="range"
                min="0"
                max="1000"
                value={filter.prisnivå[0]}
                onChange={handleMinChange}
                className="range-slider range-slider-min"
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={filter.prisnivå[1]}
                onChange={handleMaxChange}
                className="range-slider range-slider-max"
              />
            </div>
          </div>

          {/*Hytte - betjeningsgrad*/}
          <div className="filter-section">
            <label>{t("filter.betjeningsgrad")}:</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={filter.betjeningsgrad.includes("Ubetjent")}
                  onChange={() =>
                    handleCheckboxChange("betjeningsgrad", "Ubetjent")
                  }
                />{" "}
                {t("filter.ubetjent")}
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={filter.betjeningsgrad.includes("Selvbetjent")}
                  onChange={() =>
                    handleCheckboxChange("betjeningsgrad", "Selvbetjent")
                  }
                />{" "}
                {t("filter.selvbetjent")}
              </label>
              
              <label>
                <input
                  type="checkbox"
                  checked={filter.betjeningsgrad.includes("Betjent")}
                  onChange={() =>
                    handleCheckboxChange("betjeningsgrad", "Betjent")
                  }
                />{" "}
                {t("filter.betjent")}
              </label>
            </div>
          </div>

          {/*Hytte - fasiliteter*/}
          <div className="filter-section">
            <label className="filter-label-overskrift">{t("filter.fasiliteter")}:</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  //checked={filter.fasiliteter.includes("WIFI")}
                  //onChange={() =>
                  //  handleCheckboxChange("fasiliteter", "WIFI")
                  //}
                />{" "} {t("filter.wifi")}
              </label>
            </div>
          </div>

        </>
      )}
    </div>
  );
}
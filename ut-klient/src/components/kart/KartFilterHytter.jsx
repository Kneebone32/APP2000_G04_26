import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useEnums } from "../../hooks/useEnums";
import { useKategorier } from "../../hooks/useKategorier";
import FasiliteterDropdown from "../informasjon/FasiliteterDropdown";

//Alle kartfilter til hytter. Hele filen laget av Kay med mindre annet er spesifisert
export default function KartFilterHytter({ filter, setFilter, handleCheckboxChange }) {
  const [hytterFilterUtvidet, setHytterFilterUtvidet] = useState(false);
  const { kategorier } = useKategorier();
  const { enumData: betjeningsgradEnum, loadingEnum, enumError } = useEnums("betjeningsgrad_enum");
  const { t } = useTranslation();

  //Laget av AI
  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value);
    if (newMin <= filter.prisnivå[1]) {
      setFilter({
        ...filter,
        prisnivå: [newMin, filter.prisnivå[1]],
      });
    }
  };

  //Laget av AI
  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value);
    if (newMax >= filter.prisnivå[0]) {
      setFilter({
        ...filter,
        prisnivå: [filter.prisnivå[0], newMax],
      });
    }
  };

  return (
    <div className="kart-filter-section">
      <button className="filter-toggle-button" onClick={() => setHytterFilterUtvidet(!hytterFilterUtvidet)}>
        {hytterFilterUtvidet ? "✕" : "☰"} {t("filter.hytter")}
      </button>

      {hytterFilterUtvidet && (
        <>
          {/*Hytte - vis hytter*/}
          <div className="hytter-kart-toggle">
            <label>
              <input type="checkbox" checked={filter.visHytter} onChange={(e) => setFilter({ ...filter, visHytter: e.target.checked })} />{" "}
              {t("filter.vis_hytter")}
            </label>
          </div>

          {/*Hytte - søkefelt*/}
          <div className="filter-section">
            <label>
              {t("felles.søk")}:
              <input
                type="text"
                placeholder={t("filter.søk_hytte")}
                value={filter.søkeordHytter}
                onChange={(e) => setFilter({ ...filter, søkeordHytter: e.target.value })}
              />
            </label>
          </div>

          {/*Hytte - prisnivå*/}
          <div className="filter-section">
            <label>
              {t("filter.prisnivå")}: {filter.prisnivå[0]} kr - {filter.prisnivå[1]} kr
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
            </label>
          </div>

          {/*Hytte - betjeningsgrad*/}
          <div className="filter-section">
            <label>
              {t("filter.betjeningsgrad")}:
              <div className="checkbox-group">
                {!loadingEnum &&
                  !enumError &&
                  betjeningsgradEnum.map((grad) => (
                    <label key={grad}>
                      <input
                        type="checkbox"
                        checked={filter.betjeningsgrad.includes(grad)}
                        onChange={() => handleCheckboxChange("betjeningsgrad", grad)}
                      />{" "}
                      {grad}
                    </label>
                  ))}
              </div>
            </label>
          </div>

          {/*Hytte - fasiliteter*/}
          <FasiliteterDropdown
            overskrift={t("filter.fasiliteter")}
            alleValg={kategorier.fasilitet}
            valgteFasiliteter={filter.fasiliteter}
            onToggle={(fasilitet_navn) => handleCheckboxChange("fasiliteter", fasilitet_navn)}
          />
        </>
      )}
    </div>
  );
}

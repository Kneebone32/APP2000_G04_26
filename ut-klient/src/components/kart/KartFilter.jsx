import "./KartFilter.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import KartFilterHytter from "./KartFilterHytter";
import KartFilterFellesturer from "./KartFilterFellesturer";
import KartFilterTurmål from "./KartFilterTurmål";
import KartFilterTurer from "./KartFilterTurer";

//Håndterer alle kartfilter. Laget av Kay
export default function KartFilter({ onFilterChange }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState({
    søkeord: "",
    betjeningsgrad: [],
    prisnivå: [0, 1000],
    visHytter: true,
    visFellesturer: true,
    visTurmål: true,
    visTurer: true
  });

  //Oppdaterer når filter endrer seg
  useEffect(() => {
    onFilterChange(filter);
  }, [filter, onFilterChange]);

  //håndterer checkbox-endringer. Laget av AI
  const handleCheckboxChange = (filterType, value) => {
    setFilter((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((v) => v !== value)
        : [...prev[filterType], value],
    }));
  };

  //resetter alle filter
  const handleReset = () => {
    setFilter({
      søkeord: "",
      betjeningsgrad: [],
      prisnivå: [0, 1000],
      visHytter: true,
      visFellesturer: true,
      visTurmål: true,
      visTurer: true
    });
  };

  return (
    <div className="kart-filter-wrapper">
      {/*Filter til hytter*/}
      <KartFilterHytter 
        filter={filter}
        setFilter={setFilter}
        handleCheckboxChange={handleCheckboxChange}
      />

      {/*Filter til fellesturer*/}
      <KartFilterTurer 
        filter={filter}
        setFilter={setFilter}
      />

      {/*Filter til fellesturer*/}
      <KartFilterFellesturer 
        filter={filter}
        setFilter={setFilter}
      />

      {/*Filter til turmål*/}
      <KartFilterTurmål
        filter={filter}
        setFilter={setFilter}
      />     

      {/*Reset filter*/}
      <button className="reset-button" onClick={handleReset}>
        {t("felles.nullstill")}
      </button>
    </div>
  );
}

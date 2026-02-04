import "./KartFilter.css";
import { useState, useEffect } from "react";
import KartFilterHytter from "./KartFilterHytter";
import KartFilterFellesturer from "./KartFilterFellesturer";
import KartFilterTurmål from "./KartFilterTurmål";

//Håndterer alle kartfilter. Laget av Kay
export default function KartFilter({ onFilterChange }) {
  const [filter, setFilter] = useState({
    søkeord: "",
    betjeningsgrad: [],
    visHytter: true,
    visFellesturer: true,
    visTurmål:true
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
      visHytter: true,
      visFellesturer: true,
      visTurmål: true
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
        Nullstill
      </button>
    </div>
  );
}

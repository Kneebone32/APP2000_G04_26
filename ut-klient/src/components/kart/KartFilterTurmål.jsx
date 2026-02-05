import { useState } from "react";

//Alle kartfilter til turmål.
export default function KartFilterTurmål({ filter, setFilter }) {
  const [turmålFilterUtvidet, setTurmålFilterUtvidet] = useState(false);

  return (
    <div className="kart-filter-section">
      <button
        className="filter-toggle-button"
        onClick={() =>
          setTurmålFilterUtvidet(!turmålFilterUtvidet)
        }
      >
        {turmålFilterUtvidet ? "✕" : "☰"} Turmål
      </button>

      {turmålFilterUtvidet && (
        <>
          {/*Turmål - vis turmål*/}
          <div className="turmål-kart-toggle">
            <label>
              <input
                type="checkbox"
                checked={filter.visTurmål}
                onChange={(e) =>
                  setFilter({ ...filter, visTurmål: e.target.checked })
                }
              />{" "}
               Vis turmål
            </label>
          </div>
        </>
      )}
    </div>
  );
}

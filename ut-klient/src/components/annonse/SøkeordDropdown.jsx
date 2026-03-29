import '../informasjon/FasiliteterDropdown.css';

// Dropdown for å velge søkeord fra enum-liste. Basert på FasiliteterDropdown som Kay lagde. Laget av Olai.
export default function SøkeordDropdown({ overskrift, alleValg = [], valgteOrd = [], onToggle }) {

    const handleSelectChange = (e) => {
        const valgtOrd = e.target.value;
        if (valgtOrd && !valgteOrd.includes(valgtOrd)) {
            onToggle(valgtOrd);
        }
        e.target.value = "";
    };

    return (
        <div className="multi-select-filter">
            <label className="filter-label-overskrift">{overskrift}</label>

            <select className="filter-dropdown" onChange={handleSelectChange}>
                <option value="" disabled selected hidden></option>
                {alleValg.map((ord) => (
                    <option
                        key={ord}
                        value={ord}
                        disabled={valgteOrd.includes(ord)}
                    >
                        {ord}
                    </option>
                ))}
            </select>

            <div className="tag-container">
                {valgteOrd.map((ord) => (
                    <span key={ord} className="tag-pill">
                        {ord}
                        <button
                            type="button"
                            className="tag-fjern-btn"
                            onClick={() => onToggle(ord)}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
}

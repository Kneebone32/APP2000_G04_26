import './FasiliteterDropdown.css';

//Laget av Kay
//Håndterer dropdown & lagring av valgene for fasiliteter. Kan gjøres mer dynamisk hvis vi trenger
export default function FasiliteterDropdown({ overskrift, alleValg = [], valgteFasiliteter = [], onToggle}) {
    
    //Sjekker om 
    const handleSelectChange = (e) => {
        const nyFasilitet = e.target.value;
        if (valgteFasiliteter && !valgteFasiliteter.includes(nyFasilitet)) {
            onToggle(nyFasilitet);
        }
        e.target.value = ""; 
    };

    return (
        <>
        {/*Dropdown med alle fasiliteter*/}
        <div className="multi-select-filter">
            <label className="filter-label-overskrift">{overskrift}</label>
            
            <select 
                className="filter-dropdown" 
                onChange={handleSelectChange}
            >
                <option value="" disabled selected hidden></option>
                {alleValg.map((valg) => (
                    <option 
                        key={valg.navn}
                        value={valg.navn} 
                        disabled={valgteFasiliteter.includes(valg.navn)}
                    >
                        {valg.navn}
                    </option>
                ))}
            </select>

            {/*Legger valgene i en list under dropdown*/}
            <div className="tag-container">
                {valgteFasiliteter.map((navn) => (
                    <span key={navn} className="tag-pill">
                        {navn}
                        <button 
                            type="button"
                            className="tag-fjern-btn"
                            onClick={() => onToggle(navn)}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
        </div>
        </>
    );
}
import './FasiliteterDropdown.css';

//Laget av Kay
//Håndterer dropdown & lagring av valgene for fasiliteter. Kan gjøres mer dynamisk hvis vi trenger
export default function FasiliteterDropdown({ overskrift, alleValg = [], valgteFasiliteter = [], onToggle}) {
    
    //Sjekker om 
    const handleSelectChange = (e) => {
        const valgtFasilitetId = e.target.value;
         const valgtFasilitet = alleValg.find(v => v.id === parseInt(valgtFasilitetId));
        if (valgtFasilitet && valgteFasiliteter && !valgteFasiliteter.some(f => f.id === valgtFasilitet.id)) {
            onToggle(valgtFasilitet);
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
                        value={valg.id} 
                        disabled={valgteFasiliteter.some(f => f.id === valg.id)}
                    >
                        {valg.navn}
                    </option>
                ))}
            </select>

            {/*Legger valgene i en list under dropdown*/}
            <div className="tag-container">
                {valgteFasiliteter.map((fasilitet) => (
                    <span key={fasilitet.id} className="tag-pill">
                        {fasilitet.navn}
                        <button 
                            type="button"
                            className="tag-fjern-btn"
                            onClick={() => onToggle(fasilitet)}
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
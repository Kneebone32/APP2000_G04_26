

export default function TempBilde({ tempUrl, setTempUrl, onLeggTil }) {
    return (
        <div className="input-container">
            <label className="input">
                Legg til Bilde URL (testing)
                <div>
                    <input
                        type="text"
                        placeholder="Lim inn URL her"
                        value={tempUrl}
                        onChange={(e) => setTempUrl(e.target.value)}
                    />
                    <button 
                        type="button" 
                        onClick={onLeggTil} 
                        className="legg-til-btn"
                    >
                        Legg til
                    </button>
                </div>
            </label>
        </div>
    );
}
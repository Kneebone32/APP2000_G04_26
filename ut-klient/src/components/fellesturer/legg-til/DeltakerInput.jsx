//refactor for å holde LegTilFellestur mindre. Laget av Kay
//Min & Maks deltakere til fellestur.
export default function DeltakerInput({ minDeltakere, maksDeltakere, onMinChange, onMaksChange }) {
    return (
        <>
            <div className="input-container">
                <label className="input">
                    Min deltakere
                    <input
                        type="number"
                        value={minDeltakere}
                        onChange={(e) => onMinChange(e.target.value)}
                        min="1"
                        max="1000"
                        required
                    />
                </label>
            </div>

            <div className="input-container">
                <label className="input">
                    Maks deltakere
                    <input
                        type="number"
                        value={maksDeltakere}
                        onChange={(e) => onMaksChange(e.target.value)}
                        min={minDeltakere}
                        max="1000"
                        required
                    />
                </label>
            </div>
        </>
    );
}
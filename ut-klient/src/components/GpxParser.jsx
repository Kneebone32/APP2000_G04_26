import { parseGPX } from '@we-gold/gpxjs';

//Laster opp og Parser koordinater fra GPX-fil. Laget av Kay
export const GpxParser = ({onKoordinaterLastet}) => {
  
  const handleFileChange = (e) => {
    const fil = e.target.files[0];
    if (!fil) return;

    const leser = new FileReader();
    leser.onload = (event) => {
      try {
        const gpxText = event.target.result;
        const gpx = parseGPX(gpxText);
        console.log('GPX parsed:', gpx);
        console.log('Type:', typeof gpx, 'Is array:', Array.isArray(gpx));

        // Check if gpx exists and is valid
        if (!gpx) {
          console.error('GPX parsing returned undefined');
          return;
        }

        // Check if gpx has waypoints
        if (Array.isArray(gpx) && gpx.length > 0 && gpx[0] && gpx[0].waypoints && gpx[0].waypoints.length > 0) {
          const koords = gpx[0].waypoints.map(p => [p.latitude, p.longitude]);
          onKoordinaterLastet(koords);
        } else {
          console.error('No waypoints found in GPX file');
        }
      } catch (err) {
        console.error("Parsing error:", err);
      }
    };
    leser.readAsText(fil);
  };

  return (
    <div className="gpx-filopplasting">
      <label className="gpx-filopplasting-label">
        Last opp GPX fil
      </label>
      <div>
        <input 
          type="file" 
          accept=".gpx" 
          onChange={handleFileChange} 
          className="gpx-filopplasting-input"
        />
      </div>
    </div>
  );
};
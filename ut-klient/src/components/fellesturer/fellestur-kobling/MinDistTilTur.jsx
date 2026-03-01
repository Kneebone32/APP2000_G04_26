import { getDistanceBetweenPoints } from "../../../utils/geoUtils";

//Returnerer min distanse mellom hytte og TurRutePunkt. Laget av Kay
export const minDistTilTur = (hytteLat, hytteLon, turKoords) => {
    if (!turKoords || turKoords.length === 0) return Infinity;
    
    const distances = turKoords.map(punkt => 
        getDistanceBetweenPoints(hytteLat, hytteLon, punkt[0], punkt[1])
    );

    return Math.min(...distances);
};
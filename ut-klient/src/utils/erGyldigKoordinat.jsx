import { getDistanceBetweenPoints } from "./geoUtils";

const UGYLDIG_HYTTE = ["elv", "innsjø", "innsjøRegulert", "havflate"];
const UGYLDIG_TUR = ["innsjø", "innsjøRegulert", "havflate"];
const UGYLDIG_TURMÅL = ["havflate"];

//Sjekker om koordinatene er har gyldig terreng-type. Laget av Kay
export const erGyldigKoordinatEttPunkt = (høydeData, kategori = "hytte") => {
  if (!høydeData.terreng) return false; //null-check
  const terrengType = høydeData.terreng.toLowerCase();

  if (kategori.toLocaleLowerCase() === "hytte") {
    return !UGYLDIG_HYTTE.some((ugyldig) => terrengType.includes(ugyldig));
  }

  if (kategori.toLocaleLowerCase() === "tur") {
    return !UGYLDIG_TUR.some((ugyldig) => terrengType.includes(ugyldig));
  }

  if (kategori.toLocaleLowerCase() === "turmål") {
    return !UGYLDIG_TURMÅL.some((ugyldig) => terrengType.includes(ugyldig));
  }

  return true;
};

//Sjekker om 2 koordinater er nær nok til å være på samme sted. Toleranse i km
export const erSammeKoordinat = (koord1, koord2, toleranseKm = 0.01) => {
  if (!koord1 || !koord2) return false;
  const lat1 = typeof koord1 === "object" ? koord1[0] : koord1;
  const lng1 = typeof koord1 === "object" ? koord1[1] : koord1;
  const lat2 = typeof koord2 === "object" ? koord2[0] : koord2;
  const lng2 = typeof koord2 === "object" ? koord2[1] : koord2;

  const avstand = getDistanceBetweenPoints(lat1, lng1, lat2, lng2);
  return avstand <= toleranseKm;
};

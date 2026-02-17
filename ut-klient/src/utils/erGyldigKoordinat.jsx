const UGYLDIG_HYTTE = ["elv", "innsjø", "innsjøRegulert", "havflate"];
const UGYLDIG_TUR = ["innsjø", "innsjøRegulert", "havflate"];
const UGYLDIG_TURMÅL = ["havflate"];

//Sjekker om koordinatene er har gyldig terreng-type. Laget av Kay
export const erGyldigKoordinatEttPunkt = (høydeData, kategori = "hytte") => {
    if(!høydeData.terreng) return false; //null-check
    const terrengType = høydeData.terreng.toLowerCase();

    if(kategori.toLocaleLowerCase() === "hytte"){
        return !UGYLDIG_HYTTE.some(ugyldig => terrengType.includes(ugyldig));
    }

    if(kategori.toLocaleLowerCase() === "tur"){
        return !UGYLDIG_TUR.some(ugyldig => terrengType.includes(ugyldig));
    }

    if(kategori.toLocaleLowerCase() === "turmål"){
        return !UGYLDIG_TURMÅL.some(ugyldig => terrengType.includes(ugyldig));
    }


    return true;
}
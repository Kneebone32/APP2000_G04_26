//Laget av Kay
//Legger til/fjerner datoer til/fra en Array
export const toggleDatoArray = (valgteDatoer, nyDato) => {
  const datoTid = nyDato.getTime();
  const finnes = valgteDatoer.find((d) => d.getTime() === datoTid);

  if (finnes) {
    return valgteDatoer.filter((dato) => dato.getTime() !== datoTid);
  } else {
    return [...valgteDatoer, nyDato].sort((a, b) => a - b); //sorterer etter dato
  }
};

//Formaterer datoen til norsk format
export const formatNorskdato = (dato) => {
  return dato.toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};


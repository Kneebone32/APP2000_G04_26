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
    minute: "2-digit",
  });
};

//Formaterer datoen til norsk format
export const formatNorskTid = (tid) => {
  return tid.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

//Formaterer dato + tid på en pen måte. Laget av AI
export const formatMeldingTid = (dato) => {
  const d = new Date(dato);
  const iDag = new Date();
  const erIDag = d.getDate() === iDag.getDate() && d.getMonth() === iDag.getMonth() && d.getFullYear() === iDag.getFullYear();

  if (erIDag) {
    return d.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
  }
  const dag = String(d.getDate()).padStart(2, "0");
  const måned = String(d.getMonth() + 1).padStart(2, "0");
  const time = String(d.getHours()).padStart(2, "0");
  const minutt = String(d.getMinutes()).padStart(2, "0");
  return `${dag}.${måned} ${time}:${minutt}`;
};

export const formatFellesturDato = (dato) => {
  return new Date(dato).toLocaleString("nb-NO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

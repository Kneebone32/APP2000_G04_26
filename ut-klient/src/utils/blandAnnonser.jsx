// Bland inn annonser i en liste med items (feks turer eller hytter). Laget av Olai
export function blandInnAnnonser(items, annonser, type, intervall = 3) {
  const liste = [];
  let annonseIndex = 0;
  items.forEach((item, i) => {
    liste.push({ type, data: item });
    if ((i + 1) % intervall === 0 && annonseIndex < annonser.length) {
      liste.push({ type: 'annonse', data: annonser[annonseIndex++] });
    }
  });
  return liste;
}

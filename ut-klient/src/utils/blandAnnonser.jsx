// Bland inn annonser i en liste med items (feks turer eller hytter). Laget av Olai
export function blandInnAnnonser(items, annonser, type) {
  const liste = items.map(item => ({ type, data: item }));
  annonser.forEach(a => {
    const pos = Math.floor(Math.random() * (liste.length + 1));
    liste.splice(pos, 0, { type: 'annonse', data: a });
  });
  return liste;
}

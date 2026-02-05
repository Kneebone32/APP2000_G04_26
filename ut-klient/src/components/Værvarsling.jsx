
//Funksjon som henter værvarsel for det neste døgnet fra Yr. Laget av Kay
export function VærvarslingDag({latitude, longitude}) {
  const yrUrlDag = `https://www.yr.no/nb/innhold/${latitude},${longitude}/card.html?mode=light`;

  return (
    <div className="yr-widget-container">
      <iframe
        src={yrUrlDag}
        width= "100%"
        height= "372px"
        style={{border: 'none', borderRadius: '8px'}}
      ></iframe>
    </div>
  );
}

//Funksjon som henter værvarsel for den neste uken fra Yr. Laget av Kay
export function VærvarslingUke({latitude, longitude}) {
  const yrUrlUke = `https://www.yr.no/nb/innhold/${latitude},${longitude}/table.html?mode=light`;

  return (
    <div className="yr-widget-container">
      <iframe
        src={yrUrlUke}
        width= "100%"
        height= "372px"
        style={{border: 'none', borderRadius: '8px'}}
      ></iframe>
    </div>
  );
}
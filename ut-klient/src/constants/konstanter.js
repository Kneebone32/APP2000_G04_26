//JS sin versjon av enums. Kan bruke Object.freeze for å gjøre dem immutable. Laget av Kay

//bruker_roller fra databasen
export const BRUKER_ROLLE = {
    ADMIN: 'admin',
    TURLEDER: 'turleder',
    HYTTEEIER: 'hytteeier',
    ANNONSØR: 'annonsør',
    VANLIGBRUKER: 'vanligbruker'
};

//Faner i AnnonseModerator
export const ANNONSE_FANER = ["Legg til", 
    "Rediger", 
    "Slett", 
    "Godkjenn", 
    "Statistikk"
];

//Fellestur påmeldingsstatus
export const PÅMELDING_STATUS = {
    INTERESSERT: 'interessert',
    BINDENDE: 'bindende',
    FRISTILT: 'fristilt',
    AVMELDT: 'avmeldt'
};



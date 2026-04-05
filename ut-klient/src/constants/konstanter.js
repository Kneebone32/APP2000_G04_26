//JS sin versjon av enums. Kan bruke Object.freeze for å gjøre dem immutable. Laget av Kay og Olai

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

//Faner i HytteModerator
export const HYTTE_FANER = ["Legg til", "Rediger", "Slett"];

//Faner i TurModerator
export const TUR_FANER = ["Legg til", "Rediger", "Slett"];

//Fellestur påmeldingsstatus
export const PÅMELDING_STATUS = {
    INTERESSERT: 'interessert',
    BINDENDE: 'bindende',
    FRISTILT: 'fristilt',
    AVMELDT: 'avmeldt'
};



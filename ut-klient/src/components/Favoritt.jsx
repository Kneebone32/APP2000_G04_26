//Håndterer klikk på favorittikon. Laget av Kay
export const handleFavoritt = (e, openLogginn, onToggleFavoritt) => {
    e.preventDefault();

    if (!localStorage.getItem('token')) {
        openLogginn();
        return;
    }
    onToggleFavoritt();
};

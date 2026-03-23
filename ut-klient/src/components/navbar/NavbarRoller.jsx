import { Link } from "react-router-dom";

//rollespesifikke lenker i navbar-dropdown. Laget av Kay
export default function NavbarRoller({ brukerRolle, onClick }) {
    //if (brukerRolle === 'admin') {
    if (!brukerRolle) {
        return (
            <Link to="/admin" onClick={onClick} className="dropdown-valg">
                Admin
            </Link>
        );
    }

    if (brukerRolle === 'annonsør') {
        return (
            <Link to="/annonser" onClick={onClick} className="dropdown-valg">
                Mine annonser
            </Link>
        );
    }

    return null;
}

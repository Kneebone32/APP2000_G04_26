import { Link } from "react-router-dom";
import { BRUKER_ROLLE } from "../../constants/konstanter";

const ROLLE_LENKER = {
  [BRUKER_ROLLE.ADMIN]: { link_til: "/admin", label: "Admin panel" },
  [BRUKER_ROLLE.ANNONSØR]: { link_til: "/annonser", label: "Mine annonser" },
  [BRUKER_ROLLE.TURLEDER]: { link_til: "/turleder/fellesturer", label: "Rediger fellestur" },
  [BRUKER_ROLLE.HYTTEEIER]: { link_til: "/hytteeier/hytter", label: "Rediger hytter" },
};

//rollespesifikke lenker i navbar-dropdown. Laget av Kay
export default function NavbarRoller({ mineRoller = [], onClick }) {
  const lenker = mineRoller.map((rolle) => ROLLE_LENKER[rolle.rolle_navn]).filter(Boolean);

  if (lenker.length === 0) return null;

  return lenker.map(({ link_til, label }) => (
    <Link key={link_til} to={link_til} onClick={onClick} className="dropdown-valg">
      {label}
    </Link>
  ));
}

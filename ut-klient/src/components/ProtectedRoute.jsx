import { Navigate, Outlet } from "react-router-dom";
import { useAutentisering } from "../hooks/useAutentisering";

//Beskyttede ruter basert på denne artikkelen: https://medium.com/@dennisivy/creating-protected-routes-with-react-router-v6-2c4bbaf7bc1c
//Gjemmer noen sider bak innlogging og brukerrolle. Laget av Kay
export default function ProtectedRoute({ rolle }) {
    const { erAutentisert, mineRoller, loading, lasterRoller } = useAutentisering({ autoFetch: true });

    if (loading || lasterRoller) return null;
    if (!erAutentisert) return <Navigate to="/" replace />;
    if (rolle && !mineRoller.some(r => r.rolle_navn === rolle)) return <Navigate to="/" replace />;

    return <Outlet />;
}
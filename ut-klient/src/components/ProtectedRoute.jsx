import { Navigate, Outlet } from "react-router-dom";
import { useAutentisering } from "../hooks/useAutentisering";

//Beskyttede ruter basert på denne artikkelen: https://medium.com/@dennisivy/creating-protected-routes-with-react-router-v6-2c4bbaf7bc1c
//Gjemmer noen sider bak innlogging og brukerrolle. Laget av Kay
export default function ProtectedRoute({rolle}) {
    const { erAutentisert, bruker, loading } = useAutentisering({autoFetch: true});

    if (loading) return null;
    if (!erAutentisert) return <Navigate to="/" replace />;
    //if (rolle && bruker?.bruker_rolle !== rolle) return <Navigate to="/" replace />;

    return <Outlet />;
}

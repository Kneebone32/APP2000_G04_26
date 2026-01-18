import { Link } from "react-router-dom";

const Feilside = () => {
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center text-center">
      <div>
        <h1 className="display-1 fw-bold">404</h1>
        <p className="lead mb-4">Siden finnes ikke</p>

        <Link to="/" className="btn btn-success">
          Gå til forsiden
        </Link>
      </div>
    </div>
  );
};

export default Feilside;
export default function PageWrapper({ title, children }) {
  return (
    <div className="p-2">
      <h1 className="display-4 fw-bold mb-4">{title}</h1>
      {children || <p className="lead">Prototypeinnhold kommer her...</p>}
    </div>
  );
}

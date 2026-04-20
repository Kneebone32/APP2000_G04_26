import "./PageWrapper.css";

export default function PageWrapper({ title, children }) {
  return (
    <div className="Page">
      <h1 className="Wrapper">{title}</h1>
      {children}
    </div>
  );
}

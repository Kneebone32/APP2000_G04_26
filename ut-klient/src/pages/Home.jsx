import PageWrapper from "../components/PageWrapper";
import './Home.css';

export default function Home() {
  return (
    <div className="Home">
      <PageWrapper title="Velkommen til UT.ut" />
      <h1 className="test">Dette er en test for å se om Heroku fungerer..</h1> 
    </div>
  );
}
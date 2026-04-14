import LeggTilArtikkel from '../components/artikkel/LeggTilArtikkel';
import RedigerArtikkel from '../components/artikkel/RedigerArtikkel';
import SlettArtikkel from '../components/artikkel/SlettArtikkel';
import PageWrapper from '../components/PageWrapper';

//Adminside for artikler. Laget av Kay
export default function ArtikkelModerator() {
    return (
        <PageWrapper>
            <div className="FellesturModeratorPanel">
                <h1>Artikler</h1>
                <hr />
                <LeggTilArtikkel />
                <hr />
                <RedigerArtikkel />
                <hr />
                <SlettArtikkel />
            </div>
        </PageWrapper>
    );
}
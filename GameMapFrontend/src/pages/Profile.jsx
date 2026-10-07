
import SimpleSectionCard from "../components/atoms/SimpleSectionCard";
import NavBar from "../components/layoutComponents/NavBar";



export default function Profile() {

    return(
        <>
            <NavBar />
            <SimpleSectionCard >
                <div>Hier kann man seine Profil Daten ändern</div>
            </SimpleSectionCard>
        </>
    )
}
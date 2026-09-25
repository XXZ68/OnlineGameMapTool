import NavBar from "../components/NavBar";
import Sidebar from "../components/SideBar";
import { SimpleSectionCard } from "../components/SimpleSectionCard";



export default function Profile() {

    return(
        <>
            <NavBar />
            <Sidebar />

            <SimpleSectionCard >
                <div>Hier kann man seine Profil Daten ändern</div>
            </SimpleSectionCard>
        </>
    )
}
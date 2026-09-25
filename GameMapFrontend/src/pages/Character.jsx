import NavBar from "../components/NavBar";
import Sidebar from "../components/SideBar";
import { SimpleSectionCard } from "../components/SimpleSectionCard";



export default function Character() {

    return(
        <>
            <NavBar />
            <Sidebar />

            <SimpleSectionCard >
                <div>Hier kann man seine Charaktere einsehen (Maybe out of Scope)</div>
            </SimpleSectionCard>
        </>
    )
}
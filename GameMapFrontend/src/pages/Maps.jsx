import NavBar from "../components/NavBar";
import Sidebar from "../components/SideBar";
import { SimpleSectionCard } from "../components/SimpleSectionCard";


export default function Maps() {


    return (
        <div>
            <NavBar />
            <Sidebar />
            <SimpleSectionCard >
                <div>Hier könnten alle geuploadeten/gepieleten Karten aufgelistet werden</div>
            </SimpleSectionCard>
        </div>        
    )
}
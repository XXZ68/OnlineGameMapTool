
import TextArea from "./TextArea";
import Button from "./atoms/buttons/Button";


export default function NotesForm() {

    return (
        <div>
            <p>Hier könnten Notes aufgelistet werden</p>
            <form>
                <TextArea />
                <Button>
                    Save
                </Button>
            </form>
        </div>
    )
}
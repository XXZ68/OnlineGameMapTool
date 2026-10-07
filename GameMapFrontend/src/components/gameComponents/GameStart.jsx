import Button from "./Button";
import Modal from "./Modal";
import TextInput from "./TextInput";


export default function GameStart() {

    return (
        <Modal>
            <form>
                <TextInput
                    placeholder="Character Name"
                    />
                
                <Button variant="secondary" type="button">Choose Character</Button>
            </form>
        </Modal>
    )
}
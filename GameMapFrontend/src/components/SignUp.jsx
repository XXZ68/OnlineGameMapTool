import Button from "./atoms/buttons/Button"
import Modal from "./Modal"
import TextInput from "./TextInput"


function SignUp( {onClose, isOpen} ) {

    return (
        <Modal onClose={onClose} isOpen={isOpen}>
            <h2>Sign up new member</h2>
            <form className="flex flex-col justify-center"> 
                <TextInput placeholder="Display Name" className="w-full px-3 py-3 m-2" />

                <TextInput placeholder="Email" className="w-full px-3 py-3 m-2" />

                <TextInput placeholder="Password" className="w-full px-3 py-3 m-2" />

                <TextInput placeholder="Confirm Password" className="w-full px-3 py-3 m-2" />
            </form>
            <hr className="m-4" />
            <div className="flex flex-row gap-5 justify-center">
                <Button variant="primary" size="sm">
                    Submit
                </Button>
                <Button variant="danger" size="sm" onClick={onClose} >
                    Cancel
                </Button>
            </div>
        </Modal>
    )
}

export default SignUp
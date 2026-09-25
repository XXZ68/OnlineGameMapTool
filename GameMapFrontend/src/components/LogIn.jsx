import { useState } from "react";
import Modal from "./Modal";
import TextInput from "./TextInput";
import SignUp from "./SignUp";
import Button from "./atoms/buttons/Button";
import { AGBs } from "./AGBs";


function LogIn( { isOpen, onClose } ) {

    const [isSignUp, setIsSignUp] = useState(false);
    const [showAGBs, setShowAGBs] = useState(false);

    return (
        <Modal onClose={onClose} isOpen={isOpen}>
            <h2>Log in</h2>
            <form>
                <div>
                    <TextInput placeholder="Name" className="w-full px-3 py-3 m-2" />
                    <TextInput placeholder="Password" className="w-full px-3 py-3 m-2" />
                </div>
                <Button variant="primary" className="mt-2" onClick={() => setShowAGBs(true)}>
                    Submit
                </Button>
                {showAGBs &&                    
                    <AGBs 
                        isOpen={showAGBs} 
                        onClose={() => setShowAGBs(false)} 
                    />}
            </form>
            <hr className="m-4"/>
            <div className="mb-4">
                You... Dont have an Account already??
            </div>
            <Button variant="secondary" onClick={() => setIsSignUp(true)}>
                Shame on my head
            </Button>
            <SignUp isOpen={isSignUp} onClose={() => setIsSignUp(false)}/>
        </Modal>
    )
}

export default LogIn
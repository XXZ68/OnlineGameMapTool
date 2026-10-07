import Button from '../atoms/Button'
import Modal from '../atoms/Modal'
import TextInput from '../atoms/TextInput'

type SignUpProps = {
  onClose: () => void
  isOpen: boolean
}

function SignUp({
  onClose,
  isOpen,
}: SignUpProps) {
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <h2>Sign up as a new member</h2>

      <form className="flex flex-col justify-center">
        <TextInput
          placeholder="Display Name"
          className="w-full px-3 py-3 mt-4"
        />

        <TextInput
          type="password"
          placeholder="Password"
          className="w-full px-3 py-3 mt-4"
        />

        <TextInput
          type="password"
          placeholder="Confirm Password"
          className="w-full px-3 py-3 mt-4"
        />
      </form>

      <hr className="m-4" />

      <div className="flex flex-row gap-5 justify-center">
        <Button
          variant="primary"
          size="sm"
        >
          Submit
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  )
}

export default SignUp

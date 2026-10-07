import Button from '../atoms/Button'
import Modal from '../atoms/Modal'
import TextInput from '../atoms/TextInput'

type GameStartProps = {
  isOpen: boolean
  onClose: () => void
}

export default function GameStart({
  isOpen,
  onClose,
}: GameStartProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form>
        <TextInput placeholder="Character Name" />

        <Button
          variant="secondary"
          type="button"
        >
          Choose Character
        </Button>
      </form>
    </Modal>
  )
}
import Button from '../atoms/Button'
import Modal from '../atoms/Modal'

type CookiesProps = {
  isOpen: boolean
  onClose: () => void
}

export default function Cookies({
  isOpen,
  onClose,
}: CookiesProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2>Diese Website verwendet Cookies</h2>

        <p className="mt-4">
          Wir verwenden Cookies, um Inhalte und Anzeigen zu personaliesieren,
          Funktionen für soziale Medien anbieten zu können und die Zugriffe auf
          unsere Website zu analysieren. Außerdem geben wir Informationen zu
          Ihrer Verwendung unserer Website an unsere Partner für soziale
          Medien, Werbung und Analaysieren weiter. Unsere Partner führen diese
          Informationen möglicherweise mit weiteren Daten zusammen, die Sie
          ihnen bereitgestellt haben oder die Sie im Rahmen ihrer Nutzung der
          Dienste gesammelt haben.
        </p>

        <h2 className="mt-4">
          Big Goblin Brother is always Watching
        </h2>
      </div>

      <div>
        <p className="mt-4">
          If you prefer to pay so we dont sell your data to Musk here you go
        </p>

        <div className="flex flex-row gap-4 justify-center mt-4">
          <Button variant="primary" onClick={onClose}>
            Ad Free for 9,99€ / Month
          </Button>

          <Button variant="secondary" onClick={onClose}>
            Decline
          </Button>
        </div>
      </div>
    </Modal>
  )
}
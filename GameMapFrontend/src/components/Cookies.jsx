import Button from "./atoms/buttons/Button";
import Modal from "./Modal";


export default function Cookies( {isOpen, onClose} ) {

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div>
                <h2>Diese Website verwendet Cookies</h2>
                <p>
                    Wir verwenden Cookies, um Inhalte und Anzeigen zu personaliesieren, Funktionen für soziale Medien anbieten zu können und die Zugriffe auf unsere Website zu analysieren. Außerdem geben wir Informationen zu Ihrer Verwendung unserer Website an unsere Partner für soziale Medien, Werbung und Analaysieren weiter. Unsere Partner führen diese Informationen möglicherweise mit weiteren Daten zusammen, die Sie ihnen bereitgestellt haben oder die Sie im Rahmen ihrer Nutzung der Dienste gesammelt haben.
                </p>
                <h2>Big Goblin Brother is always Watching</h2>
            </div>
            <div>
                <p>
                    If you prefer to pay so we dont sell your data to Musk here you go
                </p>
                <div className="flex flex-row gap-4 justify-center">
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
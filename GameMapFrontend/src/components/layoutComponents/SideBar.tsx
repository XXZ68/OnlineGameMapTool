import Button from '../atoms/Button'

type SidebarProps = {
  onCreateGameClick: () => void
  onCreateCampaignClick: () => void
}

export default function Sidebar({
  onCreateGameClick,
  onCreateCampaignClick,
}: SidebarProps) {
  return (
    <nav className="fixed top-18 left-0 w-56 h-screen">
      <div>
        <ul className="p-5">
          <li>
            <Button
              variant="primary"
              onClick={onCreateCampaignClick}
            >
              Create New Campaign
            </Button>
          </li>

          <li>
            <Button
              variant="primary"
              onClick={onCreateGameClick}
            >
              Create Game as DM
            </Button>
          </li>

          <li>
            <a href="/api/game">Return to Game</a>
          </li>

          <li>
            <a href="/api/Map">My Maps</a>
          </li>

          <li>
            <a href="/api/Character">My Characters</a>
          </li>

          <li>
            <a href="/api/profile">Profile</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
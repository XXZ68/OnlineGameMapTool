

export default function Sidebar() {

  return (
    <nav className="fixed top-18 left-0 w-56 h-screen">
        <div>
            <ul className="p-5">
                <li><a href="/maps">My Maps</a></li>
                <li><a href="char">My Characters</a></li>
                <li><a href="profile">Profile</a></li>
            </ul>
        </div>
    </nav>
  )
}


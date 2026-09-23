
export default function NavBar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 shadow-md">
      {/* Logo */}
      <a href="/" className="text-xl font-bold tracking-wide hover:text-gray-300 transition-colors">
        Logo
      </a>

      {/* Navigation Links */}
      <ul className="flex items-center gap-6 m-0 p-0 list-none">
        <li>
          <a href="/features" className="text-gray-300 hover:text-white transition-colors text-sm">Profile</a>
        </li>
        <li>
          <a href="/pricing" className="text-gray-300 hover:text-white transition-colors text-sm">Browse our Maps</a>
        </li>
        <li>
          <a href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">Browse our Spells</a>
        </li>
        <li>
          <a href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">Browse our Characters</a>
        </li>
        <li>
          <a href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">Get inspired to write your own Story</a>
        </li>
      </ul>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button className="px-4 py-2 text-sm font-medium hover:text-gray-300 transition-colors cursor-pointer">
          Log In
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-accent-complementary hover:bg-purple-700 text-white rounded-lg transition-colors cursor-pointer">
          Sign Up
        </button>
      </div>
    </nav>
  );
}

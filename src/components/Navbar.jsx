import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/add-blood-sugar', label: 'Blood sugar' },
  { to: '/add-insulin', label: 'Insulin' },
  { to: '/history', label: 'History' },
  { to: '/charts', label: 'Charts' },
  { to: '/reminders', label: 'Reminders' },
  { to: '/report', label: 'Report' }
];

function Navbar() {
  const { user, storageMode, signOut, isSupabaseConfigured } = useAuth();

  async function handleLogout() {
    await signOut();
  }

  return (
    <header className="navbar">
      <div className="brand">
        <span className="brand-mark">G</span>
        <div>
          <strong>GlucoTrack</strong>
          <small>{storageMode === 'cloud' ? `Cloud mode · ${user?.email}` : 'Local browser mode'}</small>
        </div>
      </div>

      <nav className="nav-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {link.label}
          </NavLink>
        ))}

        {user ? (
          <button className="nav-link nav-button" onClick={handleLogout}>Logout</button>
        ) : (
          <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            {isSupabaseConfigured ? 'Login' : 'Setup login'}
          </NavLink>
        )}
      </nav>
    </header>
  );
}

export default Navbar;

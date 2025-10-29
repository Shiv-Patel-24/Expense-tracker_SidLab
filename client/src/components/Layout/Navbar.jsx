import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaWallet, FaUser, FaSignOutAlt } from 'react-icons/fa'
import '../../styles/navbar.css'
import '../../styles/buttons.css';


const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <FaWallet className="brand-icon" />
          <span>Expense Tracker</span>
        </Link>

        {user && (
          <div className="navbar-menu">
            <div className="navbar-user">
              <FaUser className="user-icon" />
              <span className="user-name">{user.name}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-logout">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

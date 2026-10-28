import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Leave Management System
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/employees" className={isActive('/employees')}>
              Employees
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/leave-request" className={isActive('/leave-request')}>
              Submit Leave
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/leaves" className={isActive('/admin/leaves')}>
              Admin Panel
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

import { Link } from "react-router-dom";
import "../../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            Leave Management
          </Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/employees">Employees</Link>
          </li>
          <li>
            <Link to="/submit-leave">Submit Leave</Link>
          </li>
          <li>
            <Link to="/admin/leaves">Admin - Leaves</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

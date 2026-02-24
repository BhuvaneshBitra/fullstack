import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  return (
    <nav>
      <Link to="/">Home</Link>
      {currentUser ? (
        <>
          <Link to={`/${currentUser.role}`}>Dashboard</Link>
          <button onClick={() => {
            localStorage.removeItem('currentUser');
            window.location.reload();
          }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

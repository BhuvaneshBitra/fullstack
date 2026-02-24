
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import './App.css';
import HomePage from './pages/HomePage';
import Admin from './pages/Admin';
import UserPage from './pages/UserPage';

function App() {
  return (
    <BrowserRouter>
      <div className="navbar">
        <Link to="/">
        <button>Home</button>
        </Link>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<UserPage />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
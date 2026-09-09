import { Link } from "react-router-dom";
import "./styles/Header.css";
import ThemeToggle from "../components/ThemeToggle.tsx";

function Header() {
    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-title">TaskHub</Link>
                <ThemeToggle />
            </div>
            <nav className="header-nav">
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </nav>
        </header>
    );
}

export default Header;
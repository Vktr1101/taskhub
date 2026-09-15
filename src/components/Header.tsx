import { useContext } from "react";
import { Link } from "react-router-dom";
import "./styles/Header.css";
import ThemeToggle from "../components/ThemeToggle.tsx";
import { UserContext } from "../context/UserContext.tsx";

function Header() {
    const { user } = useContext(UserContext);

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-title">TaskHub</Link>
                <ThemeToggle />
            </div>
            <nav className="header-nav">
                {user ? (
                    <Link to="/profile" className="username-link">
                        <i className="fa-solid fa-circle-user"></i>&nbsp;{user.username}
                    </Link>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;
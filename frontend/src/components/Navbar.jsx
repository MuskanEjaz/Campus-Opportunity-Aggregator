import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from "./NotificationBell";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/opportunities');
    }

    return (
        <nav className="bg-indigo-700 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

                {/* Logo */}
                <Link to="/opportunities" className="text-xl font-bold tracking-tight">
                    🎓 Campus Opportunities
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link to="/opportunities" className="hover:text-indigo-200 transition">
                        Browse
                    </Link>
                    {user ? (
                        <>
                            <Link to="/saved" className="hover:text-indigo-200 transition">
                                Saved
                            </Link>
                            <NotificationBell />
                            <span className="text-indigo-200">
                                Hello, {user.user_name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-white text-indigo-700 px-4 py-1.5 rounded-full 
                                           font-semibold hover:bg-indigo-100 transition">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login"
                                className="hover:text-indigo-200 transition">
                                Login
                            </Link>
                            <Link to="/register"
                                className="bg-white text-indigo-700 px-4 py-1.5 rounded-full 
                                           font-semibold hover:bg-indigo-100 transition">
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}>
                    <div className="space-y-1">
                        <span className={`block w-6 h-0.5 bg-white transition-transform 
                                        ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-white transition-opacity 
                                        ${menuOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-6 h-0.5 bg-white transition-transform 
                                        ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                    </div>
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-indigo-800 px-4 py-3 flex flex-col gap-3 text-sm">
                    <Link to="/opportunities"
                        onClick={() => setMenuOpen(false)}
                        className="hover:text-indigo-200">
                        Browse
                    </Link>
                    {user ? (
                        <>
                            <Link to="/saved"
                                onClick={() => setMenuOpen(false)}
                                className="hover:text-indigo-200">
                                Saved
                            </Link>
                            <button onClick={handleLogout}
                                className="text-left hover:text-indigo-200">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login"
                                onClick={() => setMenuOpen(false)}
                                className="hover:text-indigo-200">
                                Login
                            </Link>
                            <Link to="/register"
                                onClick={() => setMenuOpen(false)}
                                className="hover:text-indigo-200">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
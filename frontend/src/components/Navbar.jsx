import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from "./NotificationBell";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    function handleLogout() {
        logout();
        navigate('/opportunities');
    }

    function isActive(path) {
        return location.pathname === path;
    }

    return (
        <nav style={{
            background: 'linear-gradient(135deg, #1e2a4a 0%, #2d3d6e 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 2px 20px rgba(0,0,0,0.15)'
        }}>
            <div className="max-w-7xl mx-auto px-4 py-0">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link
                        to="/opportunities"
                        className="flex items-center gap-2.5 group"
                        style={{ textDecoration: 'none' }}>
                        <div style={{
                            width: 34, height: 34,
                            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                            borderRadius: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 16,
                            boxShadow: '0 2px 8px rgba(245,158,11,0.4)',
                            flexShrink: 0
                        }}>
                            🎓
                        </div>
                        <div>
                            <span style={{
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                color: '#ffffff',
                                letterSpacing: '-0.01em',
                                lineHeight: 1,
                                display: 'block'
                            }}>
                                Campus Opportunities
                            </span>
                            <span style={{
                                fontSize: '0.65rem',
                                color: 'rgba(255,255,255,0.45)',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                display: 'block',
                                marginTop: 1
                            }}>
                                Discover · Apply · Grow
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/opportunities" active={isActive('/opportunities')}>
                            Browse
                        </NavLink>
                        {user ? (
                            <>
                                <NavLink to="/saved" active={isActive('/saved')}>
                                    Saved
                                </NavLink>
                                <div className="mx-2">
                                    <NotificationBell />
                                </div>
                                <div style={{
                                    width: 1, height: 20,
                                    background: 'rgba(255,255,255,0.15)',
                                    margin: '0 8px'
                                }} />
                                <span style={{
                                    fontSize: '0.8rem',
                                    color: 'rgba(255,255,255,0.6)',
                                    fontWeight: 500,
                                    padding: '0 8px'
                                }}>
                                    {user.user_name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        color: '#fff',
                                        borderRadius: 8,
                                        padding: '6px 14px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        fontFamily: "'DM Sans', sans-serif"
                                    }}
                                    onMouseEnter={e => {
                                        e.target.style.background = 'rgba(255,255,255,0.18)';
                                    }}
                                    onMouseLeave={e => {
                                        e.target.style.background = 'rgba(255,255,255,0.1)';
                                    }}>
                                    Log out
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" active={isActive('/login')}>
                                    Login
                                </NavLink>
                                <Link
                                    to="/register"
                                    style={{
                                        marginLeft: 4,
                                        background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                                        color: '#1e2a4a',
                                        borderRadius: 8,
                                        padding: '7px 16px',
                                        fontSize: '0.82rem',
                                        fontWeight: 700,
                                        textDecoration: 'none',
                                        boxShadow: '0 2px 8px rgba(245,158,11,0.35)',
                                        transition: 'all 0.2s',
                                        display: 'inline-block'
                                    }}>
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden focus:outline-none p-2"
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{ color: '#fff' }}>
                        <div className="space-y-1.5">
                            <span className={`block w-5 h-0.5 bg-white transition-all duration-200 origin-center
                                ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`block w-5 h-0.5 bg-white transition-all duration-200
                                ${menuOpen ? 'opacity-0' : ''}`} />
                            <span className={`block w-5 h-0.5 bg-white transition-all duration-200 origin-center
                                ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div style={{
                    background: 'rgba(20, 28, 50, 0.98)',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    padding: '12px 16px 16px'
                }}>
                    <div className="flex flex-col gap-1">
                        <MobileNavLink to="/opportunities" onClick={() => setMenuOpen(false)}>Browse</MobileNavLink>
                        {user ? (
                            <>
                                <MobileNavLink to="/saved" onClick={() => setMenuOpen(false)}>Saved</MobileNavLink>
                                <div style={{ padding: '8px 12px', color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>
                                    Signed in as {user.user_name}
                                </div>
                                <button
                                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                                    style={{
                                        textAlign: 'left',
                                        padding: '9px 12px',
                                        color: '#fca5a5',
                                        fontSize: '0.85rem',
                                        fontWeight: 500,
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontFamily: "'DM Sans', sans-serif",
                                        borderRadius: 8
                                    }}>
                                    Log out
                                </button>
                            </>
                        ) : (
                            <>
                                <MobileNavLink to="/login" onClick={() => setMenuOpen(false)}>Login</MobileNavLink>
                                <MobileNavLink to="/register" onClick={() => setMenuOpen(false)}>Register</MobileNavLink>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

function NavLink({ to, active, children }) {
    return (
        <Link
            to={to}
            style={{
                padding: '7px 12px',
                borderRadius: 8,
                fontSize: '0.82rem',
                fontWeight: 500,
                color: active ? '#ffffff' : 'rgba(255,255,255,0.65)',
                background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
                display: 'inline-block'
            }}>
            {children}
        </Link>
    );
}

function MobileNavLink({ to, onClick, children }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            style={{
                padding: '9px 12px',
                borderRadius: 8,
                fontSize: '0.88rem',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                display: 'block',
                transition: 'background 0.15s'
            }}>
            {children}
        </Link>
    );
}
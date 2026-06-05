import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'https://campus-opportunity-aggregator-1.onrender.com';

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setStatus('error');
            setMessage('No verification token found in the link. Please use the link from your email.');
            return;
        }

        fetch(`${API}/api/auth/verify-email?token=${encodeURIComponent(token)}`)
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    setStatus('success');
                    setMessage(data.message);
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Verification failed.');
                }
            })
            .catch(() => {
                setStatus('error');
                setMessage('Could not connect to the server. Please try again.');
            });
    }, [searchParams]);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f0e2b 0%, #1e1b4b 55%, #312e81 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
            position: 'relative', overflow: 'hidden',
        }}>
            {/* Background blobs */}
            <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(167,139,250,0.09)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -60, left: '20%', width: 240, height: 240, borderRadius: '50%', background: 'rgba(109,40,217,0.12)', pointerEvents: 'none' }} />

            <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 24,
                padding: '48px 44px',
                width: '100%', maxWidth: 460,
                textAlign: 'center',
                backdropFilter: 'blur(16px)',
                position: 'relative', zIndex: 1,
            }}>
                {/* Logo */}
                <div style={{
                    width: 56, height: 56,
                    background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                    borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, margin: '0 auto 20px',
                    boxShadow: '0 4px 20px rgba(124,58,237,0.45)',
                }}>🎓</div>

                <p style={{ fontSize: '0.72rem', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                    Campus Opportunity Aggregator · NUST
                </p>

                {/* Loading */}
                {status === 'loading' && (
                    <>
                        <div style={{
                            width: 44, height: 44, margin: '28px auto 20px',
                            border: '4px solid rgba(167,139,250,0.25)',
                            borderTopColor: '#a78bfa',
                            borderRadius: '50%',
                            animation: 'spin 0.9s linear infinite',
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>
                            Verifying your email…
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem' }}>
                            Just a moment, please don't close this page.
                        </p>
                    </>
                )}

                {/* Success */}
                {status === 'success' && (
                    <>
                        <div style={{
                            width: 72, height: 72, margin: '20px auto 24px',
                            background: 'rgba(16,185,129,0.15)',
                            border: '2px solid rgba(16,185,129,0.40)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2rem',
                        }}>
                            ✅
                        </div>
                        <h2 style={{
                            color: '#fff', fontSize: '1.45rem',
                            fontWeight: 800, marginBottom: 10,
                            fontFamily: "'Playfair Display', serif",
                        }}>
                            Email verified!
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 32 }}>
                            {message}
                        </p>
                        <Link
                            to="/login"
                            style={{
                                display: 'inline-block',
                                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                                color: '#fff', textDecoration: 'none',
                                borderRadius: 12, padding: '13px 36px',
                                fontWeight: 700, fontSize: '0.95rem',
                                boxShadow: '0 4px 18px rgba(109,40,217,0.40)',
                                transition: 'transform 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            Go to Login →
                        </Link>
                    </>
                )}

                {/* Error */}
                {status === 'error' && (
                    <>
                        <div style={{
                            width: 72, height: 72, margin: '20px auto 24px',
                            background: 'rgba(239,68,68,0.12)',
                            border: '2px solid rgba(239,68,68,0.35)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2rem',
                        }}>
                            ❌
                        </div>
                        <h2 style={{
                            color: '#fff', fontSize: '1.45rem',
                            fontWeight: 800, marginBottom: 10,
                            fontFamily: "'Playfair Display', serif",
                        }}>
                            Verification failed
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 28 }}>
                            {message}
                        </p>
                        <ResendForm />
                    </>
                )}
            </div>
        </div>
    );
}

function ResendForm() {
    const [email, setEmail]     = useState('');
    const [sent, setSent]       = useState(false);
    const [loading, setLoading] = useState(false);
    const [err, setErr]         = useState('');

    async function handleResend(e) {
        e.preventDefault();
        setLoading(true); setErr('');
        try {
            const res  = await fetch(`${API}/api/auth/resend-verification`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) { setErr(data.message || 'Failed.'); }
            else { setSent(true); }
        } catch {
            setErr('Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    }

    if (sent) {
        return (
            <div style={{
                background: 'rgba(16,185,129,0.10)',
                border: '1px solid rgba(16,185,129,0.30)',
                borderRadius: 12, padding: '14px 18px',
                color: '#6ee7b7', fontSize: '0.875rem', lineHeight: 1.6,
            }}>
                ✅ If that address is registered and unverified, a new link has been sent. Check your inbox.
            </div>
        );
    }

    return (
        <div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginBottom: 14 }}>
                Need a new verification link? Enter your email below.
            </p>
            <form onSubmit={handleResend} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                    type="email" required
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                        background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: 10, padding: '10px 14px',
                        color: '#fff', fontSize: '0.875rem', outline: 'none',
                    }}
                />
                {err && <p style={{ color: '#fca5a5', fontSize: '0.8rem' }}>{err}</p>}
                <button
                    type="submit" disabled={loading}
                    style={{
                        background: loading ? 'rgba(167,139,250,0.3)' : 'rgba(124,58,237,0.35)',
                        border: '1px solid rgba(167,139,250,0.40)',
                        borderRadius: 10, padding: '10px',
                        color: '#e0d7ff', fontWeight: 700, fontSize: '0.875rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? 'Sending…' : 'Resend verification email'}
                </button>
            </form>
            <div style={{ marginTop: 20 }}>
                <Link to="/register" style={{ color: 'rgba(167,139,250,0.7)', fontSize: '0.82rem', textDecoration: 'none' }}>
                    ← Back to Register
                </Link>
            </div>
        </div>
    );
}

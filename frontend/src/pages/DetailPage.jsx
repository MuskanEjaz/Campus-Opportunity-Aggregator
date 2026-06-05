import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';

const CATEGORY_STYLES = {
    'Internship':       { bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.35)',  text: '#93c5fd' },
    'Scholarship':      { bg: 'rgba(168,85,247,0.15)',  border: 'rgba(168,85,247,0.35)',  text: '#d8b4fe' },
    'Hackathon':        { bg: 'rgba(249,115,22,0.15)',  border: 'rgba(249,115,22,0.35)',  text: '#fdba74' },
    'Workshop':         { bg: 'rgba(20,184,166,0.15)',  border: 'rgba(20,184,166,0.35)',  text: '#5eead4' },
    'Competition':      { bg: 'rgba(236,72,153,0.15)',  border: 'rgba(236,72,153,0.35)',  text: '#f9a8d4' },
    'Research':         { bg: 'rgba(99,102,241,0.15)',  border: 'rgba(99,102,241,0.35)',  text: '#a5b4fc' },
    'Exchange Program': { bg: 'rgba(6,182,212,0.15)',   border: 'rgba(6,182,212,0.35)',   text: '#67e8f9' },
    'Course':           { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.35)',  text: '#6ee7b7' },
};
const DEFAULT_STYLE = { bg: 'rgba(156,163,175,0.15)', border: 'rgba(156,163,175,0.3)', text: '#d1d5db' };

function getDeadlineInfo(deadline) {
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / 86400000);
    if (daysLeft < 0)   return { label: 'Deadline passed', color: '#6b7280', bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.25)' };
    if (daysLeft === 0) return { label: 'Due today',       color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.35)' };
    if (daysLeft <= 3)  return { label: `${daysLeft}d left`, color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)' };
    if (daysLeft <= 7)  return { label: `${daysLeft}d left`, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)' };
    return { label: `${daysLeft} days left`, color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.30)' };
}

export default function DetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const { isSaved, markSaved, markUnsaved } = useSaved();
    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const saved = isSaved(id);

    const [showApply, setShowApply] = useState(false);
    const [applyForm, setApplyForm] = useState({ name: '', email: '', statement: '' });
    const [applyStatus, setApplyStatus] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchOpportunity() {
            try {
                const response = await api.get(`/api/search/${id}`);
                setOpportunity(response.data.data);
                await api.post(`/api/search/${id}/view`);
            } catch (err) {
                setError('Failed to load opportunity details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchOpportunity();
    }, [id]);

    async function handleApplySubmit(e) {
        e.preventDefault();
        if (!applyForm.name || !applyForm.email || !applyForm.statement) return;
        setSubmitting(true);
        setApplyStatus(null);
        try {
            await new Promise(res => setTimeout(res, 1000));
            setApplyStatus('success');
            setApplyForm({ name: '', email: '', statement: '' });
        } catch {
            setApplyStatus('error');
        } finally {
            setSubmitting(false);
        }
    }

    async function handleSave() {
        if (!token) { navigate('/login'); return; }
        try {
            if (saved) {
                await api.delete(`/api/bookmarks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                markUnsaved(id);
            } else {
                await api.post('/api/bookmarks', { opp_id: id }, { headers: { Authorization: `Bearer ${token}` } });
                markSaved(id);
            }
        } catch (err) {
            if (err.response?.status === 409) markSaved(id);
        }
    }

    if (loading) {
        return (
            <div style={{ background: '#0d0b23', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    border: '3px solid rgba(167,139,250,0.2)',
                    borderTopColor: '#a78bfa',
                    animation: 'spin 0.8s linear infinite',
                }} />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ background: '#0d0b23', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <div style={{
                    background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.30)',
                    color: '#fca5a5', borderRadius: 14, padding: '24px 32px', textAlign: 'center',
                }}>
                    <p style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 12 }}>{error}</p>
                    <button onClick={() => navigate('/opportunities')}
                        style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
                        ← Back to listings
                    </button>
                </div>
            </div>
        );
    }

    const catStyle = CATEGORY_STYLES[opportunity.category] || DEFAULT_STYLE;
    const dl = getDeadlineInfo(opportunity.deadline);
    const deadlineFormatted = new Date(opportunity.deadline).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const createdFormatted = new Date(opportunity.created_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const inputStyle = {
        width: '100%',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(167,139,250,0.20)',
        borderRadius: 10,
        padding: '10px 14px',
        fontSize: '0.875rem',
        color: '#e2e0ff',
        outline: 'none',
        fontFamily: "'DM Sans', sans-serif",
    };
    const labelStyle = { display: 'block', fontSize: '0.78rem', color: 'rgba(167,139,250,0.7)', fontWeight: 600, marginBottom: 6, letterSpacing: '0.04em' };

    return (
        <div style={{ background: '#0d0b23', minHeight: '100vh', padding: '32px 16px 60px' }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes detailFadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } } .detail-fade { animation: detailFadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }`}</style>

            <div style={{ maxWidth: 760, margin: '0 auto' }}>

                {/* Back button */}
                <button
                    onClick={() => navigate('/opportunities')}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: 'rgba(167,139,250,0.10)',
                        border: '1px solid rgba(167,139,250,0.20)',
                        color: '#a78bfa', borderRadius: 8,
                        padding: '7px 16px', fontSize: '0.82rem', fontWeight: 600,
                        cursor: 'pointer', marginBottom: 24,
                        fontFamily: "'DM Sans', sans-serif",
                        transition: 'all 0.18s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(167,139,250,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(167,139,250,0.10)'}
                >
                    ← Back to opportunities
                </button>

                {/* Main card */}
                <div className="detail-fade" style={{
                    background: 'linear-gradient(145deg, #17153a 0%, #120f2e 100%)',
                    border: '1px solid rgba(167,139,250,0.15)',
                    borderRadius: 24,
                    overflow: 'hidden',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
                }}>
                    {/* Header band */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(99,102,241,0.10) 100%)',
                        borderBottom: '1px solid rgba(167,139,250,0.12)',
                        padding: '28px 32px',
                    }}>
                        {/* Badges row */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                background: catStyle.bg, border: `1px solid ${catStyle.border}`,
                                borderRadius: 100, padding: '4px 14px',
                                fontSize: '0.75rem', fontWeight: 700, color: catStyle.text,
                            }}>
                                {opportunity.category}
                            </span>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                background: dl.bg, border: `1px solid ${dl.border}`,
                                borderRadius: 100, padding: '4px 12px',
                                fontSize: '0.75rem', fontWeight: 700, color: dl.color,
                            }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                </svg>
                                {dl.label}
                            </span>
                            <span style={{
                                background: opportunity.is_paid ? 'rgba(16,185,129,0.15)' : 'rgba(107,114,128,0.12)',
                                border: `1px solid ${opportunity.is_paid ? 'rgba(16,185,129,0.35)' : 'rgba(107,114,128,0.25)'}`,
                                borderRadius: 100, padding: '4px 12px',
                                fontSize: '0.75rem', fontWeight: 700,
                                color: opportunity.is_paid ? '#6ee7b7' : '#9ca3af',
                            }}>
                                {opportunity.is_paid ? 'Paid' : 'Unpaid'}
                            </span>
                        </div>

                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                            fontWeight: 800, color: '#f1f0ff',
                            lineHeight: 1.25, marginBottom: 10,
                        }}>
                            {opportunity.title}
                        </h1>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, fontSize: '0.8rem', color: 'rgba(167,139,250,0.65)' }}>
                            {[
                                { icon: '🏛', v: opportunity.department },
                                { icon: '📍', v: opportunity.mode },
                                { icon: '👁', v: `${opportunity.views_count} views` },
                                { icon: '🔖', v: `${opportunity.save_count} saves` },
                            ].map(m => m.v && (
                                <span key={m.v} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <span>{m.icon}</span>{m.v}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

                        {/* Quick-details grid */}
                        {(opportunity.organization || opportunity.location || opportunity.duration || opportunity.stipend) && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                gap: 16,
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(167,139,250,0.12)',
                                borderRadius: 14, padding: '18px 20px',
                            }}>
                                {[
                                    { label: 'Organization', value: opportunity.organization, icon: '🏢' },
                                    { label: 'Location',     value: opportunity.location,     icon: '📍' },
                                    { label: 'Duration',     value: opportunity.duration,     icon: '⏱' },
                                    { label: 'Compensation', value: opportunity.stipend,      icon: '💰', highlight: true },
                                ].filter(r => r.value).map(row => (
                                    <div key={row.label}>
                                        <p style={{ fontSize: '0.65rem', color: 'rgba(167,139,250,0.5)', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 5 }}>{row.label}</p>
                                        <p style={{ fontSize: '0.88rem', color: row.highlight ? '#6ee7b7' : '#e2e0ff', fontWeight: row.highlight ? 700 : 600 }}>
                                            {row.icon} {row.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* About */}
                        <div>
                            <p style={{ fontSize: '0.68rem', color: 'rgba(167,139,250,0.5)', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 10 }}>About this opportunity</p>
                            <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, fontSize: '0.92rem' }}>{opportunity.description}</p>
                        </div>

                        {/* Eligibility */}
                        {opportunity.eligibility && (
                            <div style={{
                                background: 'rgba(245,158,11,0.06)',
                                border: '1px solid rgba(245,158,11,0.20)',
                                borderRadius: 12, padding: '14px 18px',
                            }}>
                                <p style={{ fontSize: '0.65rem', color: 'rgba(251,191,36,0.6)', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 7 }}>Eligibility</p>
                                <p style={{ fontSize: '0.875rem', color: 'rgba(251,191,36,0.85)', lineHeight: 1.65 }}>{opportunity.eligibility}</p>
                            </div>
                        )}

                        {/* Required Skills */}
                        {opportunity.required_skills?.length > 0 && (
                            <div>
                                <p style={{ fontSize: '0.65rem', color: 'rgba(167,139,250,0.5)', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 10 }}>Required Skills</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {opportunity.required_skills.map(skill => (
                                        <span key={skill} style={{
                                            background: 'rgba(99,102,241,0.15)',
                                            border: '1px solid rgba(99,102,241,0.30)',
                                            color: '#a5b4fc', borderRadius: 7,
                                            padding: '5px 13px', fontSize: '0.8rem', fontWeight: 600,
                                        }}>{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {opportunity.tags?.length > 0 && (
                            <div>
                                <p style={{ fontSize: '0.65rem', color: 'rgba(167,139,250,0.5)', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 10 }}>Tags</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {opportunity.tags.map(tag => (
                                        <span key={tag} style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.10)',
                                            color: 'rgba(255,255,255,0.45)',
                                            borderRadius: 6, padding: '4px 10px',
                                            fontSize: '0.78rem', fontWeight: 500,
                                        }}>#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Deadline banner */}
                        <div style={{
                            background: dl.bg, border: `1px solid ${dl.border}`,
                            borderRadius: 12, padding: '16px 20px',
                        }}>
                            <p style={{ fontSize: '0.72rem', color: dl.color, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>Application Deadline</p>
                            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: dl.color, marginBottom: 3 }}>{deadlineFormatted}</p>
                            <p style={{ fontSize: '0.82rem', color: dl.color, opacity: 0.75 }}>{dl.label}</p>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: 12 }}>
                            {opportunity.application_link ? (
                                <a
                                    href={opportunity.application_link}
                                    target="_blank" rel="noopener noreferrer"
                                    style={{
                                        flex: 1, textAlign: 'center',
                                        background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                                        color: '#fff', padding: '13px',
                                        borderRadius: 12, fontWeight: 700,
                                        fontSize: '0.95rem', textDecoration: 'none',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                        boxShadow: '0 4px 20px rgba(124,58,237,0.45)',
                                        transition: 'all 0.2s',
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 28px rgba(124,58,237,0.65)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.45)'}
                                >
                                    Apply Now ↗
                                </a>
                            ) : (
                                <button
                                    onClick={() => setShowApply(true)}
                                    style={{
                                        flex: 1,
                                        background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                                        color: '#fff', padding: '13px',
                                        borderRadius: 12, fontWeight: 700,
                                        fontSize: '0.95rem', border: 'none', cursor: 'pointer',
                                        boxShadow: '0 4px 20px rgba(124,58,237,0.45)',
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                >
                                    Apply Now
                                </button>
                            )}
                            <button
                                onClick={handleSave}
                                title={saved ? 'Remove bookmark' : 'Save opportunity'}
                                style={{
                                    width: 48, height: 48, flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    borderRadius: 12,
                                    background: saved ? 'rgba(109,40,217,0.30)' : 'rgba(255,255,255,0.07)',
                                    border: `1px solid ${saved ? 'rgba(167,139,250,0.45)' : 'rgba(255,255,255,0.15)'}`,
                                    color: saved ? '#c4b5fd' : 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer', transition: 'all 0.18s',
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                    fill={saved ? 'currentColor' : 'none'} viewBox="0 0 24 24"
                                    stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                            </button>
                        </div>

                        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(167,139,250,0.35)' }}>
                            Posted on {createdFormatted}
                        </p>
                    </div>
                </div>
            </div>

            {/* Apply modal */}
            {showApply && (
                <div style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 50, padding: 16,
                }}>
                    <div style={{
                        background: 'linear-gradient(145deg, #1e1b4b, #17153a)',
                        border: '1px solid rgba(167,139,250,0.20)',
                        borderRadius: 20,
                        boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
                        width: '100%', maxWidth: 440, padding: 28,
                        animation: 'detailFadeUp 0.3s ease both',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f0ff' }}>
                                Apply for {opportunity.title}
                            </h2>
                            <button
                                onClick={() => { setShowApply(false); setApplyStatus(null); }}
                                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.3rem', lineHeight: 1 }}>
                                ×
                            </button>
                        </div>

                        {applyStatus === 'success' ? (
                            <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
                                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f0ff', marginBottom: 6 }}>Application Submitted!</p>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>Good luck with your application.</p>
                                <button
                                    onClick={() => { setShowApply(false); setApplyStatus(null); }}
                                    style={{
                                        background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                                        color: '#fff', padding: '10px 28px',
                                        borderRadius: 10, border: 'none', cursor: 'pointer',
                                        fontWeight: 700, fontSize: '0.875rem',
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}>
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {[
                                    { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name' },
                                    { label: 'Email',     key: 'email', type: 'email', placeholder: 'your@email.com' },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label style={labelStyle}>{f.label}</label>
                                        <input
                                            type={f.type} required
                                            value={applyForm[f.key]}
                                            onChange={e => setApplyForm({ ...applyForm, [f.key]: e.target.value })}
                                            placeholder={f.placeholder}
                                            style={inputStyle}
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label style={labelStyle}>Why are you interested?</label>
                                    <textarea
                                        required rows={4}
                                        value={applyForm.statement}
                                        onChange={e => setApplyForm({ ...applyForm, statement: e.target.value })}
                                        placeholder="Briefly explain your interest and relevant experience..."
                                        style={{ ...inputStyle, resize: 'none' }}
                                    />
                                </div>
                                {applyStatus === 'error' && (
                                    <p style={{ fontSize: '0.82rem', color: '#f87171' }}>Something went wrong. Please try again.</p>
                                )}
                                <button
                                    type="submit" disabled={submitting}
                                    style={{
                                        background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                                        color: '#fff', padding: '12px',
                                        borderRadius: 10, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                                        fontWeight: 700, fontSize: '0.9rem', opacity: submitting ? 0.6 : 1,
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}>
                                    {submitting ? 'Submitting…' : 'Submit Application'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

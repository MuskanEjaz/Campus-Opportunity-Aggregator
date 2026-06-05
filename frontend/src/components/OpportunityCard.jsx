import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';

const CATEGORY_STYLES = {
    'Internship':       { bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.35)',  text: '#93c5fd', dot: '#3b82f6' },
    'Scholarship':      { bg: 'rgba(168,85,247,0.15)',  border: 'rgba(168,85,247,0.35)',  text: '#d8b4fe', dot: '#a855f7' },
    'Hackathon':        { bg: 'rgba(249,115,22,0.15)',  border: 'rgba(249,115,22,0.35)',  text: '#fdba74', dot: '#f97316' },
    'Workshop':         { bg: 'rgba(20,184,166,0.15)',  border: 'rgba(20,184,166,0.35)',  text: '#5eead4', dot: '#14b8a6' },
    'Competition':      { bg: 'rgba(236,72,153,0.15)',  border: 'rgba(236,72,153,0.35)',  text: '#f9a8d4', dot: '#ec4899' },
    'Research':         { bg: 'rgba(99,102,241,0.15)',  border: 'rgba(99,102,241,0.35)',  text: '#a5b4fc', dot: '#6366f1' },
    'Exchange Program': { bg: 'rgba(6,182,212,0.15)',   border: 'rgba(6,182,212,0.35)',   text: '#67e8f9', dot: '#06b6d4' },
    'Course':           { bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.35)',  text: '#6ee7b7', dot: '#10b981' },
};
const DEFAULT_STYLE = { bg: 'rgba(156,163,175,0.15)', border: 'rgba(156,163,175,0.3)', text: '#d1d5db', dot: '#9ca3af' };

function getDeadlineInfo(deadline) {
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / 86400000);
    if (daysLeft < 0)  return { label: 'Expired',         color: '#6b7280', bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.25)' };
    if (daysLeft === 0) return { label: 'Due today',       color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.35)' };
    if (daysLeft === 1) return { label: '1 day left',      color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.35)' };
    if (daysLeft <= 3)  return { label: `${daysLeft}d left`, color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)' };
    if (daysLeft <= 7)  return { label: `${daysLeft}d left`, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)' };
    return { label: `${daysLeft}d left`, color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.30)' };
}

function OpportunityCard({ opportunity, onUnsave }) {
    const navigate = useNavigate();
    const { token } = useAuth();
    const { isSaved, markSaved, markUnsaved } = useSaved();
    const [saving, setSaving] = useState(false);
    const [hovered, setHovered] = useState(false);

    const saved    = isSaved(opportunity.opp_id);
    const catStyle = CATEGORY_STYLES[opportunity.category] || DEFAULT_STYLE;
    const dl       = getDeadlineInfo(opportunity.deadline);

    async function handleSave(e) {
        e.stopPropagation();
        if (!token) { navigate('/login'); return; }
        setSaving(true);
        try {
            if (saved) {
                await api.delete(`/api/bookmarks/${opportunity.opp_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                markUnsaved(opportunity.opp_id);
                if (onUnsave) onUnsave(opportunity.opp_id);
            } else {
                await api.post('/api/bookmarks', { opp_id: opportunity.opp_id }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                markSaved(opportunity.opp_id);
            }
        } catch (err) {
            if (err.response?.status === 409) markSaved(opportunity.opp_id);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div
            onClick={() => navigate(`/opportunities/${opportunity.opp_id}`)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered
                    ? 'linear-gradient(145deg, #1e1b4b 0%, #16133d 100%)'
                    : 'linear-gradient(145deg, #17153a 0%, #120f2e 100%)',
                border: `1px solid ${hovered ? 'rgba(167,139,250,0.30)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 20,
                padding: '20px 20px 18px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                position: 'relative',
                overflow: 'hidden',
                transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
                boxShadow: hovered
                    ? '0 12px 40px rgba(109,40,217,0.25), 0 4px 16px rgba(0,0,0,0.3)'
                    : '0 2px 12px rgba(0,0,0,0.2)',
                transition: 'all 0.22s ease',
            }}
        >
            {/* Glow accent top-right */}
            <div style={{
                position: 'absolute', top: -30, right: -30,
                width: 120, height: 120, borderRadius: '50%',
                background: catStyle.bg,
                filter: 'blur(28px)',
                pointerEvents: 'none',
                opacity: hovered ? 1 : 0.5,
                transition: 'opacity 0.3s',
            }} />

            {/* Top row: category badge + paid badge + bookmark */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 36 }}>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: catStyle.bg,
                    border: `1px solid ${catStyle.border}`,
                    borderRadius: 100, padding: '4px 12px',
                    fontSize: '0.72rem', fontWeight: 700, color: catStyle.text,
                    letterSpacing: '0.02em',
                }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: catStyle.dot, flexShrink: 0 }} />
                    {opportunity.category}
                </span>

                {opportunity.is_paid ? (
                    <span style={{
                        background: 'rgba(16,185,129,0.15)',
                        border: '1px solid rgba(16,185,129,0.35)',
                        borderRadius: 100, padding: '4px 10px',
                        fontSize: '0.72rem', fontWeight: 700, color: '#6ee7b7',
                    }}>
                        Paid
                    </span>
                ) : (
                    <span style={{
                        background: 'rgba(107,114,128,0.12)',
                        border: '1px solid rgba(107,114,128,0.25)',
                        borderRadius: 100, padding: '4px 10px',
                        fontSize: '0.72rem', fontWeight: 600, color: '#9ca3af',
                    }}>
                        Unpaid
                    </span>
                )}
            </div>

            {/* Bookmark button */}
            <button
                onClick={handleSave}
                disabled={saving}
                title={saved ? 'Remove bookmark' : 'Save opportunity'}
                style={{
                    position: 'absolute', top: 16, right: 16,
                    width: 32, height: 32,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '50%',
                    background: saved ? 'rgba(109,40,217,0.30)' : 'rgba(255,255,255,0.07)',
                    border: `1px solid ${saved ? 'rgba(167,139,250,0.45)' : 'rgba(255,255,255,0.12)'}`,
                    color: saved ? '#c4b5fd' : 'rgba(255,255,255,0.35)',
                    cursor: 'pointer',
                    transition: 'all 0.18s',
                }}
            >
                {saving ? (
                    <span style={{
                        width: 12, height: 12,
                        border: '2px solid #a78bfa',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        display: 'inline-block',
                        animation: 'spin 0.7s linear infinite',
                    }} />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                        fill={saved ? 'currentColor' : 'none'} viewBox="0 0 24 24"
                        stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                )}
            </button>

            {/* Title */}
            <div>
                <h3 style={{
                    fontSize: '0.97rem', fontWeight: 700,
                    color: '#f1f0ff', lineHeight: 1.35,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                    {opportunity.title}
                </h3>
                {opportunity.organization && (
                    <p style={{ fontSize: '0.78rem', color: 'rgba(167,139,250,0.7)', marginTop: 4, fontWeight: 500 }}>
                        {opportunity.organization}
                    </p>
                )}
            </div>

            {/* Description */}
            <p style={{
                fontSize: '0.82rem', color: 'rgba(255,255,255,0.42)', lineHeight: 1.55,
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                flexGrow: 1,
            }}>
                {opportunity.description}
            </p>

            {/* Meta row */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { icon: '🏫', label: opportunity.department },
                    { icon: '📍', label: opportunity.mode },
                ].map(m => (
                    <span key={m.label} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 8, padding: '3px 10px',
                        fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)',
                    }}>
                        <span>{m.icon}</span> {m.label}
                    </span>
                ))}
            </div>

            {/* Footer: deadline + stats */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 12,
            }}>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: dl.bg, border: `1px solid ${dl.border}`,
                    borderRadius: 100, padding: '4px 12px',
                    fontSize: '0.72rem', fontWeight: 700, color: dl.color,
                }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth={2.5}>
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {dl.label}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        {opportunity.views_count}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                        {opportunity.save_count}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default memo(OpportunityCard);

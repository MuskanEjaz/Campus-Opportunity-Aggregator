import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    // Redirect if not admin
    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        if (user.role_id !== 1) { navigate('/opportunities'); }
    }, [user, navigate]);

    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null); // opp_id to confirm delete

    const [form, setForm] = useState({
        title: '',
        description: '',
        category_id: '',
        dept_id: '',
        deadline: '',
        opp_mode: '',
        is_paid: false
    });

    const authHeaders = { Authorization: `Bearer ${token}` };

    // Category and department options — adjust IDs to match your Oracle data
    const categories = [
        { id: 1, name: 'Internship' },
        { id: 2, name: 'Scholarship' },
        { id: 3, name: 'Hackathon' },
        { id: 4, name: 'Workshop' },
        { id: 5, name: 'Competition' },
        { id: 6, name: 'Research' },
        { id: 7, name: 'Exchange Program' },
        { id: 8, name: 'Fellowship' },
    ];

    const departments = [
        { id: 1, name: 'Computer Science' },
        { id: 2, name: 'Electrical Engineering' },
        { id: 3, name: 'Mechanical Engineering' },
        { id: 4, name: 'Civil Engineering' },
        { id: 5, name: 'Business Administration' },
        { id: 6, name: 'Mathematics' },
        { id: 7, name: 'Physics' },
        { id: 8, name: 'All Departments' },
    ];

    useEffect(() => {
        fetchStats();
        fetchOpportunities();
    }, []);

    async function fetchStats() {
        try {
            const res = await axios.get('/api/admin/stats', { headers: authHeaders });
            setStats(res.data.data);
        } catch (err) {
            console.error('Stats error:', err);
        }
    }

    async function fetchOpportunities() {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/opportunities', { headers: authHeaders });
            setOpportunities(res.data.data);
        } catch (err) {
            console.error('Fetch opps error:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setSubmitStatus(null);
        try {
            await axios.post('/api/admin/opportunities', form, { headers: authHeaders });
            setSubmitStatus('success');
            setForm({ title: '', description: '', category_id: '', dept_id: '', deadline: '', opp_mode: '', is_paid: false });
            fetchOpportunities();
            fetchStats();
        } catch (err) {
            setSubmitStatus('error');
            console.error('Post error:', err);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(opp_id) {
        try {
            await axios.delete(`/api/admin/opportunities/${opp_id}`, { headers: authHeaders });
            setOpportunities(prev => prev.filter(o => o.opp_id !== opp_id));
            setDeleteConfirm(null);
            fetchStats();
        } catch (err) {
            console.error('Delete error:', err);
        }
    }

    function getDaysLeft(deadline) {
        const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
        if (daysLeft < 0) return { label: 'Expired', color: 'bg-gray-100 text-gray-500' };
        if (daysLeft === 0) return { label: 'Due today', color: 'bg-red-100 text-red-600' };
        if (daysLeft <= 3) return { label: `${daysLeft}d left`, color: 'bg-red-100 text-red-600' };
        if (daysLeft <= 7) return { label: `${daysLeft}d left`, color: 'bg-yellow-100 text-yellow-700' };
        return { label: `${daysLeft}d left`, color: 'bg-green-100 text-green-700' };
    }

    const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div style={{ minHeight: '100vh', background: '#f5f4f0' }}>

            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #1e2a4a 0%, #2d3d6e 100%)', padding: '24px 32px' }}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <p style={{ color: '#fbbf24', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                            Admin Panel
                        </p>
                        <h1 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
                            Campus Opportunities Dashboard
                        </h1>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>
                        Logged in as <span style={{ color: '#fbbf24', fontWeight: 600 }}>{user?.user_name}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Active Opportunities', value: stats.total_active, color: '#4f46e5', bg: '#eef2ff' },
                            { label: 'Expired', value: stats.total_expired, color: '#6b7280', bg: '#f9fafb' },
                            { label: 'Students', value: stats.total_students, color: '#059669', bg: '#ecfdf5' },
                            { label: 'Total Saves', value: stats.total_saves, color: '#d97706', bg: '#fffbeb' },
                        ].map(stat => (
                            <div key={stat.label} style={{
                                background: '#fff', borderRadius: 12,
                                border: '1px solid #e5e7eb', padding: '20px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                            }}>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500, marginBottom: 6 }}>{stat.label}</p>
                                <p style={{ fontSize: '2rem', fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                    {[
                        { id: 'overview', label: '📋 Manage Opportunities' },
                        { id: 'post', label: '➕ Post New Opportunity' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setSubmitStatus(null); }}
                            style={{
                                padding: '9px 18px',
                                borderRadius: 8,
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                border: 'none',
                                fontFamily: "'DM Sans', sans-serif",
                                background: activeTab === tab.id ? '#1e2a4a' : '#fff',
                                color: activeTab === tab.id ? '#fff' : '#6b7280',
                                boxShadow: activeTab === tab.id ? '0 2px 8px rgba(30,42,74,0.2)' : '0 1px 3px rgba(0,0,0,0.06)',
                                transition: 'all 0.15s'
                            }}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── TAB: Manage Opportunities ── */}
                {activeTab === 'overview' && (
                    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e2a4a' }}>All Opportunities</h2>
                            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{opportunities.length} total</span>
                        </div>

                        {loading ? (
                            <div style={{ padding: 48, textAlign: 'center' }}>
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mx-auto" />
                            </div>
                        ) : opportunities.length === 0 ? (
                            <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>
                                <p style={{ fontSize: '2rem', marginBottom: 8 }}>📭</p>
                                <p>No opportunities yet. Post one using the tab above.</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f9fafb' }}>
                                            {['Title', 'Category', 'Department', 'Mode', 'Deadline', 'Views', 'Saves', 'Status', ''].map(h => (
                                                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {opportunities.map((opp, i) => {
                                            const dl = getDaysLeft(opp.deadline);
                                            return (
                                                <tr key={opp.opp_id} style={{ borderTop: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                                                    <td style={{ padding: '12px 16px', fontSize: '0.875rem', fontWeight: 600, color: '#1e2a4a', maxWidth: 200 }}>
                                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opp.title}</div>
                                                    </td>
                                                    <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#4f46e5', fontWeight: 500, whiteSpace: 'nowrap' }}>{opp.category}</td>
                                                    <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#6b7280', whiteSpace: 'nowrap' }}>{opp.department}</td>
                                                    <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#6b7280', whiteSpace: 'nowrap' }}>{opp.mode}</td>
                                                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 8px', borderRadius: 999 }} className={dl.color}>
                                                            {dl.label}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#6b7280', textAlign: 'center' }}>{opp.views_count}</td>
                                                    <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#6b7280', textAlign: 'center' }}>{opp.save_count}</td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <span style={{
                                                            fontSize: '0.72rem', fontWeight: 600,
                                                            padding: '3px 8px', borderRadius: 999,
                                                            background: opp.status === 'active' ? '#ecfdf5' : '#f3f4f6',
                                                            color: opp.status === 'active' ? '#059669' : '#9ca3af'
                                                        }}>
                                                            {opp.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        {deleteConfirm === opp.opp_id ? (
                                                            <div style={{ display: 'flex', gap: 6 }}>
                                                                <button onClick={() => handleDelete(opp.opp_id)} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 6, background: '#fee2e2', color: '#dc2626', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                                                    Confirm
                                                                </button>
                                                                <button onClick={() => setDeleteConfirm(null)} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 6, background: '#f3f4f6', color: '#6b7280', border: 'none', cursor: 'pointer' }}>
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => setDeleteConfirm(opp.opp_id)} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 6, background: '#fff', color: '#ef4444', border: '1px solid #fecaca', cursor: 'pointer', fontWeight: 500 }}>
                                                                Delete
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ── TAB: Post New Opportunity ── */}
                {activeTab === 'post' && (
                    <div style={{ maxWidth: 680 }}>
                        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: 32, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e2a4a', marginBottom: 24 }}>Post a New Opportunity</h2>

                            {submitStatus === 'success' && (
                                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#059669', fontSize: '0.875rem', fontWeight: 500 }}>
                                    ✓ Opportunity posted successfully! It's now visible to all students.
                                </div>
                            )}
                            {submitStatus === 'error' && (
                                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#dc2626', fontSize: '0.875rem' }}>
                                    Something went wrong. Please try again.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                <div>
                                    <label className={labelClass}>Title *</label>
                                    <input type="text" required className={inputClass} placeholder="e.g. Summer Internship at NUST SEECS" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                                </div>

                                <div>
                                    <label className={labelClass}>Description *</label>
                                    <textarea required rows={4} className={inputClass} placeholder="Describe the opportunity, eligibility, requirements..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div>
                                        <label className={labelClass}>Category *</label>
                                        <select required className={inputClass} value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                                            <option value="">Select category</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Department *</label>
                                        <select required className={inputClass} value={form.dept_id} onChange={e => setForm({ ...form, dept_id: e.target.value })}>
                                            <option value="">Select department</option>
                                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div>
                                        <label className={labelClass}>Application Deadline *</label>
                                        <input type="date" required className={inputClass} value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} min={new Date().toISOString().split('T')[0]} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Mode *</label>
                                        <select required className={inputClass} value={form.opp_mode} onChange={e => setForm({ ...form, opp_mode: e.target.value })}>
                                            <option value="">Select mode</option>
                                            <option value="On-campus">On-campus</option>
                                            <option value="Online">Online</option>
                                            <option value="Hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <input type="checkbox" id="is_paid" checked={form.is_paid} onChange={e => setForm({ ...form, is_paid: e.target.checked })} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                                    <label htmlFor="is_paid" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
                                        This opportunity is paid / offers a stipend
                                    </label>
                                </div>

                                <button type="submit" disabled={submitting} style={{
                                    background: submitting ? '#a5b4fc' : 'linear-gradient(135deg, #1e2a4a, #2d3d6e)',
                                    color: '#fff', border: 'none', borderRadius: 10,
                                    padding: '12px 24px', fontSize: '0.9rem', fontWeight: 700,
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    fontFamily: "'DM Sans', sans-serif",
                                    transition: 'all 0.2s'
                                }}>
                                    {submitting ? 'Posting...' : 'Post Opportunity'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
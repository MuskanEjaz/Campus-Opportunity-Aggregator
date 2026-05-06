import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function DetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Save state
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    // Apply modal state
    const [showApply, setShowApply] = useState(false);
    const [applyForm, setApplyForm] = useState({ name: '', email: '', statement: '' });
    const [applyStatus, setApplyStatus] = useState(null); // 'success' | 'error' | null
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchOpportunity() {
            try {
                const response = await axios.get(`/api/search/${id}`);
                setOpportunity(response.data.data);
                await axios.post(`/api/search/${id}/view`);
            } catch (err) {
                setError('Failed to load opportunity details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchOpportunity();
    }, [id]);

    function getDeadlineColor(deadline) {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 3) return 'bg-red-100 text-red-700 border-red-200';
        if (daysLeft <= 7) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        return 'bg-green-100 text-green-700 border-green-200';
    }

    function getDaysLeft(deadline) {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        if (daysLeft === 0) return 'Due today';
        if (daysLeft === 1) return '1 day left';
        return daysLeft + ' days left';
    }

    function getCategoryColor(category) {
        const colors = {
            'Internship': 'bg-blue-100 text-blue-700',
            'Scholarship': 'bg-purple-100 text-purple-700',
            'Hackathon': 'bg-orange-100 text-orange-700',
            'Workshop': 'bg-teal-100 text-teal-700',
            'Competition': 'bg-pink-100 text-pink-700',
            'Research': 'bg-indigo-100 text-indigo-700',
            'Exchange Program': 'bg-cyan-100 text-cyan-700',
            'Fellowship': 'bg-rose-100 text-rose-700',
        };
        return colors[category] || 'bg-gray-100 text-gray-700';
    }

    async function handleSave() {
        if (!token) { navigate('/login'); return; }
        setSaving(true);
        try {
            if (saved) {
                await axios.delete(`/api/bookmarks/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSaved(false);
            } else {
                await axios.post('/api/bookmarks', { opp_id: id }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSaved(true);
            }
        } catch (err) {
            if (err.response?.status === 409) setSaved(true);
        } finally {
            setSaving(false);
        }
    }

    async function handleApplySubmit(e) {
        e.preventDefault();
        if (!applyForm.name || !applyForm.email || !applyForm.statement) return;
        setSubmitting(true);
        setApplyStatus(null);
        // Simulate submission (replace with real API call if you have one)
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

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6 text-center">
                    <p className="text-lg font-semibold">{error}</p>
                    <button onClick={() => navigate('/opportunities')} className="mt-4 text-sm text-indigo-600 hover:underline">
                        Back to listings
                    </button>
                </div>
            </div>
        );
    }

    const deadlineFormatted = new Date(opportunity.deadline).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const createdFormatted = new Date(opportunity.created_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <button
                onClick={() => navigate('/opportunities')}
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 mb-6 transition">
                ← Back to opportunities
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={"text-xs font-semibold px-3 py-1 rounded-full " + getCategoryColor(opportunity.category)}>
                        {opportunity.category}
                    </span>
                    <span className={"text-xs font-semibold px-3 py-1 rounded-full border " + getDeadlineColor(opportunity.deadline)}>
                        {getDaysLeft(opportunity.deadline)}
                    </span>
                    <span className={"text-xs font-semibold px-3 py-1 rounded-full " + (opportunity.is_paid ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500')}>
                        {opportunity.is_paid ? 'Paid' : 'Unpaid'}
                    </span>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">{opportunity.title}</h1>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                    <span>{opportunity.department}</span>
                    <span>{opportunity.mode}</span>
                    <span>{opportunity.views_count} views</span>
                    <span>{opportunity.save_count} saves</span>
                    <span>Posted by {opportunity.posted_by}</span>
                </div>

                <hr className="border-gray-100 mb-6" />

                <div className="mb-8">
                    <h2 className="text-base font-semibold text-gray-700 mb-2">About this opportunity</h2>
                    <p className="text-gray-600 leading-relaxed">{opportunity.description}</p>
                </div>

                <div className={"rounded-xl border p-4 mb-8 " + getDeadlineColor(opportunity.deadline)}>
                    <p className="text-sm font-semibold">Application Deadline</p>
                    <p className="text-lg font-bold mt-1">{deadlineFormatted}</p>
                    <p className="text-sm mt-1">{getDaysLeft(opportunity.deadline)}</p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowApply(true)}
                        className="flex-1 text-center bg-indigo-600 text-white py-3 rounded-xl font-semibold text-base hover:bg-indigo-700 transition">
                        Apply Now
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        title={saved ? 'Remove from saved' : 'Save opportunity'}
                        className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 transition font-semibold
                            ${saved
                                ? 'border-indigo-300 bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                : 'border-gray-200 bg-white text-gray-400 hover:border-indigo-300 hover:text-indigo-500'
                            }`}>
                        {saving ? (
                            <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin inline-block" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        )}
                    </button>
                </div>

                {saved && (
                    <p className="text-xs text-indigo-500 text-center mt-2">✓ Saved to your bookmarks</p>
                )}

                <p className="text-xs text-gray-400 text-center mt-4">Posted on {createdFormatted}</p>
            </div>

            {/* Apply Now Modal */}
            {showApply && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Apply for {opportunity.title}</h2>
                            <button
                                onClick={() => { setShowApply(false); setApplyStatus(null); }}
                                className="text-gray-400 hover:text-gray-600 text-xl font-bold">
                                ✕
                            </button>
                        </div>

                        {applyStatus === 'success' ? (
                            <div className="text-center py-8">
                                <p className="text-4xl mb-3">🎉</p>
                                <p className="text-lg font-semibold text-gray-800">Application Submitted!</p>
                                <p className="text-sm text-gray-500 mt-1">Good luck with your application.</p>
                                <button
                                    onClick={() => { setShowApply(false); setApplyStatus(null); }}
                                    className="mt-5 bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleApplySubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={applyForm.name}
                                        onChange={e => setApplyForm({ ...applyForm, name: e.target.value })}
                                        placeholder="Your full name"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={applyForm.email}
                                        onChange={e => setApplyForm({ ...applyForm, email: e.target.value })}
                                        placeholder="your@email.com"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Why are you interested?</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={applyForm.statement}
                                        onChange={e => setApplyForm({ ...applyForm, statement: e.target.value })}
                                        placeholder="Briefly explain your interest and relevant experience..."
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                                    />
                                </div>
                                {applyStatus === 'error' && (
                                    <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-60">
                                    {submitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
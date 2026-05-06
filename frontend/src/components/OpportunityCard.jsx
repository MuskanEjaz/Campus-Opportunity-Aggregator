import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';

export default function OpportunityCard({ opportunity, onUnsave }) {
    const navigate = useNavigate();
    const { token } = useAuth();
    const { isSaved, markSaved, markUnsaved } = useSaved();
    const [saving, setSaving] = useState(false);

    const saved = isSaved(opportunity.opp_id);

    function getDeadlineColor(deadline) {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        if (daysLeft < 0) return 'bg-gray-100 text-gray-400';
        if (daysLeft <= 3) return 'bg-red-100 text-red-700';
        if (daysLeft <= 7) return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
    }

    function getDaysLeft(deadline) {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        if (daysLeft < 0) return 'Deadline passed';
        if (daysLeft === 0) return 'Due today';
        if (daysLeft === 1) return '1 day left';
        return `${daysLeft} days left`;
    }

    function getCategoryColor(category) {
        const colors = {
            'Internship':       'bg-blue-100 text-blue-700',
            'Scholarship':      'bg-purple-100 text-purple-700',
            'Hackathon':        'bg-orange-100 text-orange-700',
            'Workshop':         'bg-teal-100 text-teal-700',
            'Competition':      'bg-pink-100 text-pink-700',
            'Research':         'bg-indigo-100 text-indigo-700',
            'Exchange Program': 'bg-cyan-100 text-cyan-700',
            'Fellowship':       'bg-rose-100 text-rose-700',
        };
        return colors[category] || 'bg-gray-100 text-gray-700';
    }

    async function handleSave(e) {
        e.stopPropagation();
        if (!token) { navigate('/login'); return; }
        setSaving(true);
        try {
            if (saved) {
                await axios.delete(`/api/bookmarks/${opportunity.opp_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                markUnsaved(opportunity.opp_id);
                if (onUnsave) onUnsave(opportunity.opp_id);
            } else {
                await axios.post('/api/bookmarks', { opp_id: opportunity.opp_id }, {
                    headers: { Authorization: `Bearer ${token}` }
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
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5
                       hover:shadow-md hover:scale-[1.02] transition-all duration-200
                       cursor-pointer flex flex-col gap-3 relative">

            {/* Bookmark button */}
            <button
                onClick={handleSave}
                disabled={saving}
                title={saved ? 'Remove bookmark' : 'Save opportunity'}
                className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full transition
                    ${saved
                        ? 'bg-indigo-100 text-indigo-600 hover:bg-red-50 hover:text-red-400'
                        : 'bg-gray-100 text-gray-400 hover:bg-indigo-50 hover:text-indigo-500'
                    }`}>
                {saving ? (
                    <span className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin inline-block" />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                )}
            </button>

            <div className="flex items-center justify-between pr-8">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryColor(opportunity.category)}`}>
                    {opportunity.category}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full
                                 ${opportunity.is_paid
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-gray-100 text-gray-500'}`}>
                    {opportunity.is_paid ? '💰 Paid' : 'Unpaid'}
                </span>
            </div>

            <h3 className="text-base font-bold text-gray-800 leading-snug">
                {opportunity.title}
            </h3>

            <p className="text-sm text-gray-500 line-clamp-2">
                {opportunity.description}
            </p>

            <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>🏫 {opportunity.department}</span>
                <span>📍 {opportunity.mode}</span>
            </div>

            <div className="flex items-center justify-between mt-1">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDeadlineColor(opportunity.deadline)}`}>
                    ⏰ {getDaysLeft(opportunity.deadline)}
                </span>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>👁 {opportunity.views_count}</span>
                    <span>🔖 {opportunity.save_count}</span>
                </div>
            </div>
        </div>
    );
}
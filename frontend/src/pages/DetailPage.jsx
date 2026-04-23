import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function DetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchOpportunity() {
            try {
                const response = await axios.get('/api/search');
                const all = response.data.data;
                const found = all.find(o => o.opp_id === parseInt(id));
                if (found) {
                    setOpportunity(found);
                } else {
                    setError('Opportunity not found.');
                }
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
                    <button
                        onClick={() => navigate('/opportunities')}
                        className="mt-4 text-sm text-indigo-600 hover:underline">
                        Back to listings
                    </button>
                </div>
            </div>
        );
    }

    const deadlineFormatted = new Date(opportunity.deadline).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const createdFormatted = new Date(opportunity.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">

            <button
                onClick={() => navigate('/opportunities')}
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 mb-6 transition">
                Back to opportunities
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

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {opportunity.title}
                </h1>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                    <span>{opportunity.department}</span>
                    <span>{opportunity.mode}</span>
                    <span>{opportunity.views_count} views</span>
                    <span>{opportunity.save_count} saves</span>
                    <span>Posted by {opportunity.posted_by}</span>
                </div>

                <hr className="border-gray-100 mb-6" />

                <div className="mb-8">
                    <h2 className="text-base font-semibold text-gray-700 mb-2">
                        About this opportunity
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        {opportunity.description}
                    </p>
                </div>

                <div className={"rounded-xl border p-4 mb-8 " + getDeadlineColor(opportunity.deadline)}>
                    <p className="text-sm font-semibold">Application Deadline</p>
                    <p className="text-lg font-bold mt-1">{deadlineFormatted}</p>
                    <p className="text-sm mt-1">{getDaysLeft(opportunity.deadline)}</p>
                </div>

                
                <a href="#" className="block w-full text-center bg-indigo-600 text-white py-3 rounded-xl font-semibold text-base hover:bg-indigo-700 transition">
                    Apply Now
                </a>

                <p className="text-xs text-gray-400 text-center mt-4">
                    Posted on {createdFormatted}
                </p>

            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [opportunities, setOpportunities] = useState([]);
    const [expiring, setExpiring] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsRes, oppsRes, expiringRes, recoRes] = await Promise.all([
                    axios.get('/api/admin/stats'),
                    axios.get('/api/admin/opportunities'),
                    axios.get('/api/admin/expiring'),
                    axios.get('/api/admin/recommendations/2')
                ]);
                setStats(statsRes.data.data);
                setOpportunities(oppsRes.data.data);
                setExpiring(expiringRes.data.data);
                setRecommendations(recoRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    async function handleDelete(opp_id) {
        if (!window.confirm('Are you sure you want to delete this opportunity?')) return;
        try {
            await axios.delete(`/api/admin/opportunities/${opp_id}`);
            setOpportunities(prev => prev.filter(o => o.opp_id !== opp_id));
        } catch (err) {
            alert('Failed to delete opportunity');
        }
    }

    function getDaysLeft(deadline) {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        if (daysLeft === 0) return 'Due today';
        if (daysLeft === 1) return '1 day left';
        return daysLeft + ' days left';
    }

    if (loading) return (
        <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1">Manage opportunities and monitor platform activity</p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <div
                        onClick={() => navigate('/opportunities')}
                        className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 text-center cursor-pointer hover:bg-indigo-100 hover:shadow-md hover:scale-105 transition-all duration-200">
                        <p className="text-4xl font-bold text-indigo-600">{stats.total_active}</p>
                        <p className="text-sm text-gray-500 mt-2">Active Opportunities</p>
                        <p className="text-xs text-indigo-400 mt-1">Click to browse →</p>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-xl p-5 text-center hover:bg-red-100 hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer">
                        <p className="text-4xl font-bold text-red-500">{stats.total_expired}</p>
                        <p className="text-sm text-gray-500 mt-2">Expired</p>
                        <p className="text-xs text-red-400 mt-1">Closed opportunities</p>
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded-xl p-5 text-center hover:bg-green-100 hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer">
                        <p className="text-4xl font-bold text-green-600">{stats.total_students}</p>
                        <p className="text-sm text-gray-500 mt-2">Students</p>
                        <p className="text-xs text-green-400 mt-1">Registered users</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5 text-center hover:bg-yellow-100 hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer">
                        <p className="text-4xl font-bold text-yellow-600">{stats.total_saves}</p>
                        <p className="text-sm text-gray-500 mt-2">Total Saves</p>
                        <p className="text-xs text-yellow-400 mt-1">Bookmarked items</p>
                    </div>
                </div>
            )}

            {/* Expiring Soon */}
            <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6 mb-8">
                <h2 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
                    ⏰ Expiring Soon
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Next 3 Days</span>
                </h2>
                {expiring.length === 0 ? (
                    <p className="text-gray-400 text-sm">No opportunities expiring soon.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {expiring.map(opp => (
                            <div
                                key={opp.opp_id}
                                onClick={() => navigate(`/opportunities/${opp.opp_id}`)}
                                className="border border-red-100 rounded-lg p-4 bg-red-50 cursor-pointer hover:bg-red-100 hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                                <p className="font-semibold text-gray-800">{opp.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{opp.category} · {opp.department}</p>
                                <p className="text-xs text-red-600 font-bold mt-2">⚠️ {getDaysLeft(opp.deadline)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6 mb-8">
                <h2 className="text-lg font-semibold text-indigo-600 mb-4 flex items-center gap-2">
                    ⭐ Recommended For You
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">Personalized</span>
                </h2>
                {recommendations.length === 0 ? (
                    <p className="text-gray-400 text-sm">No recommendations available.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recommendations.map(opp => (
                            <div
                                key={opp.opp_id}
                                onClick={() => navigate(`/opportunities/${opp.opp_id}`)}
                                className="border border-indigo-100 rounded-lg p-4 bg-indigo-50 cursor-pointer hover:bg-indigo-100 hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                                <p className="font-semibold text-gray-800">{opp.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{opp.category} · {opp.department}</p>
                                <p className="text-xs text-indigo-600 font-bold mt-2">🔥 Score: {opp.trend_score}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Opportunities Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-700">All Opportunities</h2>
                    <span className="text-xs text-gray-400">{opportunities.length} total</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3 text-left">Title</th>
                                <th className="px-6 py-3 text-left">Category</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Views</th>
                                <th className="px-6 py-3 text-left">Saves</th>
                                <th className="px-6 py-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {opportunities.map(opp => (
                                <tr
                                    key={opp.opp_id}
                                    className="hover:bg-indigo-50 transition-colors duration-150 cursor-pointer"
                                    onClick={() => navigate(`/opportunities/${opp.opp_id}`)}>
                                    <td className="px-6 py-4 font-medium text-gray-800">{opp.title}</td>
                                    <td className="px-6 py-4 text-gray-500">{opp.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={"px-2 py-1 rounded-full text-xs font-semibold " + (opp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                                            {opp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">👁 {opp.views_count}</td>
                                    <td className="px-6 py-4 text-gray-500">🔖 {opp.save_count}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(opp.opp_id); }}
                                            className="text-red-500 hover:text-white hover:bg-red-500 border border-red-200 px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
import { useNavigate } from 'react-router-dom';

export default function OpportunityCard({ opportunity }) {
    const navigate = useNavigate();

    // Deadline urgency color
    function getDeadlineColor(deadline) {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

        if (daysLeft <= 3) return 'bg-red-100 text-red-700';
        if (daysLeft <= 7) return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
    }

    function getDaysLeft(deadline) {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        if (daysLeft === 0) return 'Due today';
        if (daysLeft === 1) return '1 day left';
        return `${daysLeft} days left`;
    }

    // Category badge color
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

    return (
        <div
            onClick={() => navigate(`/opportunities/${opportunity.opp_id}`)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 
                       hover:shadow-md hover:scale-[1.02] transition-all duration-200 
                       cursor-pointer flex flex-col gap-3">

            {/* Top row: category badge + paid badge */}
            <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full 
                                 ${getCategoryColor(opportunity.category)}`}>
                    {opportunity.category}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full 
                                 ${opportunity.is_paid 
                                    ? 'bg-emerald-100 text-emerald-700' 
                                    : 'bg-gray-100 text-gray-500'}`}>
                    {opportunity.is_paid ? '💰 Paid' : 'Unpaid'}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-base font-bold text-gray-800 leading-snug">
                {opportunity.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 line-clamp-2">
                {opportunity.description}
            </p>

            {/* Meta row: department + mode */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>🏫 {opportunity.department}</span>
                <span>📍 {opportunity.mode}</span>
            </div>

            {/* Bottom row: deadline + stats */}
            <div className="flex items-center justify-between mt-1">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full 
                                 ${getDeadlineColor(opportunity.deadline)}`}>
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
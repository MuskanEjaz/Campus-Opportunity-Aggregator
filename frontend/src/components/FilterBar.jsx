export default function FilterBar({ filters, onFilterChange, onSearch, searchTerm, onSearchChange }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 
                        flex flex-col md:flex-row gap-3">

            {/* Search input */}
            <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2 
                           text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />

            {/* Category filter */}
            <select
                value={filters.category_id}
                onChange={e => onFilterChange('category_id', e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="">All Categories</option>
                <option value="1">Internship</option>
                <option value="2">Scholarship</option>
                <option value="3">Hackathon</option>
                <option value="4">Workshop</option>
                <option value="5">Competition</option>
                <option value="6">Research</option>
                <option value="7">Exchange Program</option>
                <option value="8">Fellowship</option>
            </select>

            {/* Mode filter */}
            <select
                value={filters.opp_mode}
                onChange={e => onFilterChange('opp_mode', e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="">All Modes</option>
                <option value="remote">Remote</option>
                <option value="on-campus">On-Campus</option>
                <option value="hybrid">Hybrid</option>
            </select>

            {/* Paid filter */}
            <select
                value={filters.is_paid}
                onChange={e => onFilterChange('is_paid', e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm 
                           focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="">Paid & Unpaid</option>
                <option value="1">Paid Only</option>
                <option value="0">Unpaid Only</option>
            </select>

            {/* Search button */}
            <button
                onClick={onSearch}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm 
                           font-semibold hover:bg-indigo-700 transition">
                Search
            </button>
        </div>
    );
}
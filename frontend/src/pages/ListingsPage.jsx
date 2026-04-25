import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import OpportunityCard from '../components/OpportunityCard';
import FilterBar from '../components/FilterBar';

export default function ListingsPage() {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category_id: '',
        dept_id: '',
        opp_mode: '',
        is_paid: ''
    });
    const filtersRef = useRef(filters);

    async function fetchOpportunities(currentFilters) {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (currentFilters.category_id) params.append('category_id', currentFilters.category_id);
            if (currentFilters.dept_id) params.append('dept_id', currentFilters.dept_id);
            if (currentFilters.opp_mode) params.append('opp_mode', currentFilters.opp_mode);
            if (currentFilters.is_paid !== '') params.append('is_paid', currentFilters.is_paid);

            const response = await axios.get(`/api/search?${params.toString()}`);
            setOpportunities(response.data.data);
        } catch (err) {
            setError('Failed to load opportunities. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOpportunities(filters);
    }, []);

    function handleFilterChange(key, value) {
        const newFilters = { ...filtersRef.current, [key]: value };
        filtersRef.current = newFilters;
        setFilters(newFilters);
    }

    function handleSearch() {
        fetchOpportunities(filtersRef.current);
    }

    const filtered = opportunities.filter(opp =>
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Browse Opportunities</h1>
                <p className="text-gray-500 mt-1">Discover internships, scholarships, hackathons and more</p>
            </div>

            <div className="mb-6">
                <FilterBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSearch={handleSearch}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
            </div>

            {!loading && !error && (
                <p className="text-sm text-gray-400 mb-4">
                    Showing {filtered.length} opportunit{filtered.length === 1 ? 'y' : 'ies'}
                </p>
            )}

            {loading && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"/>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
                    {error}
                </div>
            )}

            {!loading && !error && filtered.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-5xl mb-4">🔍</p>
                    <p className="text-gray-500 text-lg">No opportunities found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                </div>
            )}

            {!loading && !error && filtered.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map(opp => (
                        <OpportunityCard key={opp.opp_id} opportunity={opp} />
                    ))}
                </div>
            )}
        </div>
    );
}
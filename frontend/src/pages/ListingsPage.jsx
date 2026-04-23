import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import OpportunityCard from '../components/OpportunityCard';
import FilterBar from '../components/FilterBar';

export default function ListingsPage() {
    const { token } = useAuth();
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

    // Fetch opportunities from backend
    async function fetchOpportunities() {
        setLoading(true);
        setError(null);
        try {
            // Build query string from filters
            const params = new URLSearchParams();
            if (filters.category_id) params.append('category_id', filters.category_id);
            if (filters.dept_id)     params.append('dept_id', filters.dept_id);
            if (filters.opp_mode)    params.append('opp_mode', filters.opp_mode);
            if (filters.is_paid !== '') params.append('is_paid', filters.is_paid);

            const response = await axios.get(`/api/search?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setOpportunities(response.data.data);
        } catch (err) {
            setError('Failed to load opportunities. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOpportunities();
    }, []);

    // Refetch when user comes back to this page
    useEffect(() => {
        const handleFocus = () => fetchOpportunities();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    // Filter by search term client-side
    const filtered = opportunities.filter(opp =>
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function handleFilterChange(key, value) {
        setFilters(prev => ({ ...prev, [key]: value }));
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            {/* Page header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Browse Opportunities
                </h1>
                <p className="text-gray-500 mt-1">
                    Discover internships, scholarships, hackathons and more
                </p>
            </div>

            {/* Filter bar */}
            <div className="mb-6">
                <FilterBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSearch={fetchOpportunities}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
            </div>

            {/* Results count */}
            {!loading && !error && (
                <p className="text-sm text-gray-400 mb-4">
                    Showing {filtered.length} opportunit{filtered.length === 1 ? 'y' : 'ies'}
                </p>
            )}

            {/* Loading state */}
            {loading && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 
                                    border-4 border-indigo-500 border-t-transparent"/>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 
                                rounded-xl p-4 text-sm">
                    {error}
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && filtered.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-5xl mb-4">🔍</p>
                    <p className="text-gray-500 text-lg">No opportunities found</p>
                    <p className="text-gray-400 text-sm mt-1">
                        Try adjusting your filters
                    </p>
                </div>
            )}

            {/* Opportunity cards grid */}
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
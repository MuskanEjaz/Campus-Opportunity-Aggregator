import { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import OpportunityCard from "../components/OpportunityCard";

export default function SavedPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("You must be logged in to view saved opportunities.");
      setLoading(false);
      return;
    }

    axios.get('/api/bookmarks', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setSaved(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load saved opportunities.");
        setLoading(false);
      });
  }, [token]);

  function handleUnsave(opp_id) {
    setSaved(prev => prev.filter(o => o.opp_id !== opp_id));
  }

  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
    </div>
  );

  if (error) return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-center">
      <p className="text-red-500 mb-4">{error}</p>
      {!token && (
        <button
          onClick={() => navigate('/login')}
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
          Log in
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Saved Opportunities</h1>

      {saved.length === 0 ? (
        <div className="text-center text-gray-500 mt-16">
          <p className="text-4xl mb-3">🔖</p>
          <p className="text-lg font-medium">No saved opportunities yet</p>
          <p className="text-sm mt-1">Browse listings and click the bookmark icon to save them here.</p>
          <button
            onClick={() => navigate('/opportunities')}
            className="mt-5 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
            Browse Opportunities
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map(opp => (
            <OpportunityCard
              key={opp.opp_id}
              opportunity={opp}
              onUnsave={handleUnsave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
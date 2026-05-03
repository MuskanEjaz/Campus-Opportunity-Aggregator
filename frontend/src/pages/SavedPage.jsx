import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import OpportunityCard from "../components/OpportunityCard";

export default function SavedPage() {
  const { token } = useContext(AuthContext);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("You must be logged in to view saved opportunities.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/bookmarks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setSaved(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load saved opportunities.");
        setLoading(false);
      });
  }, [token]);

  const handleRemove = async (opp_id) => {
    try {
      await fetch(`http://localhost:5000/api/bookmarks/${opp_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaved((prev) => prev.filter((o) => o.opp_id !== opp_id));
    } catch {
      alert("Could not remove bookmark.");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading saved opportunities...</div>;
  if (error)   return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Saved Opportunities</h1>

      {saved.length === 0 ? (
        <div className="text-center text-gray-500 mt-16">
          <p className="text-4xl mb-3">🔖</p>
          <p className="text-lg font-medium">No saved opportunities yet</p>
          <p className="text-sm mt-1">Browse listings and click the bookmark icon to save them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map((opp) => (
            <div key={opp.opp_id} className="relative">
              <OpportunityCard opportunity={opp} />
              <button
                onClick={() => handleRemove(opp.opp_id)}
                className="absolute top-3 right-3 text-xs bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 rounded-full transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
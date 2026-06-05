import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("student"); // 'student' | 'admin'
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const base = process.env.REACT_APP_API_URL || 'https://campus-opportunity-aggregator-1.onrender.com';
      const res = await fetch(`${base}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed.");
        setLoading(false);
        return;
      }

      // Check that the role matches what the user selected
      const expectedRoleId = role === "admin" ? 1 : 2;
      if (data.user.role_id !== expectedRoleId) {
        setError(
          role === "admin"
            ? "This account does not have admin privileges."
            : "Please use the Admin login for admin accounts."
        );
        setLoading(false);
        return;
      }

      login(data.token, data.user);
      navigate(role === "admin" ? "/admin" : "/");

    } catch (err) {
      setError("Could not connect to server.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f5f3ff' }}>
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8" style={{ border: '1px solid #ede9fe' }}>

        {/* Header */}
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#1a1035' }}>Welcome back</h1>
        <p className="mb-6 text-sm" style={{ color: '#6b7280' }}>Log in to your Campus Opportunities account</p>

        {/* Role Selector */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 8, marginBottom: 24,
          background: '#f5f3ff', borderRadius: 10, padding: 4
        }}>
          {[
            { id: 'student', label: '🎓 Student', desc: 'Browse & apply' },
            { id: 'admin',   label: '🛡️ Admin',   desc: 'Manage platform' },
          ].map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => { setRole(r.id); setError(''); }}
              style={{
                padding: '10px 8px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.15s',
                background: role === r.id
                  ? (r.id === 'admin' ? 'linear-gradient(135deg, #0f0e2b, #1e1b4b)' : 'linear-gradient(135deg, #7c3aed, #6d28d9)')
                  : 'transparent',
                color: role === r.id ? '#fff' : '#6b7280',
                boxShadow: role === r.id ? '0 2px 10px rgba(109,40,217,0.25)' : 'none',
              }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{r.label}</div>
              <div style={{
                fontSize: '0.72rem',
                color: role === r.id ? 'rgba(255,255,255,0.7)' : '#9ca3af',
                marginTop: 2
              }}>
                {r.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Role hint */}
        <div style={{
          background: '#f5f3ff',
          border: '1px solid #ede9fe',
          borderRadius: 8, padding: '8px 12px',
          fontSize: '0.78rem',
          color: '#6d28d9',
          marginBottom: 20
        }}>
          {role === 'admin'
            ? '🛡️ Admin accounts are created directly in the database by the system administrator.'
            : '🎓 Log in with your student account to browse and save opportunities.'
          }
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 10, padding: '11px 14px', fontSize: '0.85rem', marginBottom: 16, display: 'flex', gap: 8 }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading
                ? '#c4b5fd'
                : role === 'admin'
                  ? 'linear-gradient(135deg, #0f0e2b, #1e1b4b)'
                  : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '11px',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(109,40,217,0.38)',
            }}>
            {loading ? "Logging in..." : `Log in as ${role === 'admin' ? 'Admin' : 'Student'}`}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: '#9ca3af' }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}
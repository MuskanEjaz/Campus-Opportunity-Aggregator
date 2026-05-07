import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("student"); // 'student' | 'admin'
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f5f4f0' }}>
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h1>
        <p className="text-gray-500 mb-6 text-sm">Log in to your Campus Opportunities account</p>

        {/* Role Selector */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 8, marginBottom: 24,
          background: '#f3f4f6', borderRadius: 10, padding: 4
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
                  ? (r.id === 'admin' ? '#1e2a4a' : '#4f46e5')
                  : 'transparent',
                color: role === r.id ? '#fff' : '#6b7280',
                boxShadow: role === r.id ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
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
          background: role === 'admin' ? '#f0f4ff' : '#eef2ff',
          border: `1px solid ${role === 'admin' ? '#c7d2fe' : '#c7d2fe'}`,
          borderRadius: 8, padding: '8px 12px',
          fontSize: '0.78rem',
          color: role === 'admin' ? '#3730a3' : '#4338ca',
          marginBottom: 20
        }}>
          {role === 'admin'
            ? '🛡️ Admin accounts are created directly in the database by the system administrator.'
            : '🎓 Log in with your student account to browse and save opportunities.'
          }
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 mb-4 text-sm">
            {error}
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
                ? '#a5b4fc'
                : role === 'admin'
                  ? 'linear-gradient(135deg, #1e2a4a, #2d3d6e)'
                  : '#4f46e5',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s'
            }}>
            {loading ? "Logging in..." : `Log in as ${role === 'admin' ? 'Admin' : 'Student'}`}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}
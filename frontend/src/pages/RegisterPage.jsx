import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ user_name: "", email: "", password: "", confirm: "", dept_id: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: form.user_name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed.");
        setLoading(false);
        return;
      }

      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      setError("Could not connect to server.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Create an account</h1>
        <p className="text-gray-500 mb-6 text-sm">Join Campus Opportunities today</p>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg p-3 mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              placeholder="Zainab Hashmi"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-2 text-sm transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
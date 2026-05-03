import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";

export default function NotificationBell() {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/bookmarks/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (!token) return null; // Don't show bell if not logged in

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">No notifications yet</div>
          ) : (
            <ul className="max-h-72 overflow-y-auto divide-y divide-gray-100">
              {notifications.map((n) => (
                <li
                  key={n.notification_id}
                  className={`px-4 py-3 text-sm ${n.is_read ? "text-gray-500" : "text-gray-800 font-medium bg-indigo-50"}`}
                >
                  <p>{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.created_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
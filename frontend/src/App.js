import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ListingsPage from './pages/ListingsPage';
import DetailPage from './pages/DetailPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SavedPage from './pages/SavedPage';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Navigate to="/opportunities" />} />
                        <Route path="/opportunities" element={<ListingsPage />} />
                        <Route path="/opportunities/:id" element={<DetailPage />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/saved" element={<SavedPage />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
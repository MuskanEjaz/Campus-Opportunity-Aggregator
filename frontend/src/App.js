import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SavedProvider } from './context/SavedContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ListingsPage from './pages/ListingsPage';
import DetailPage from './pages/DetailPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SavedPage from './pages/SavedPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <SavedProvider>
                <div className="app-background">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/opportunities" element={<ListingsPage />} />
                        <Route path="/opportunities/:id" element={<DetailPage />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/saved" element={<SavedPage />} />
                        <Route path="/verify-email" element={<VerifyEmailPage />} />
                    </Routes>
                </div>
                </SavedProvider>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
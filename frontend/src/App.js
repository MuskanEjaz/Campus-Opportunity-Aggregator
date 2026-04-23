import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ListingsPage from './pages/ListingsPage';
import DetailPage from './pages/DetailPage';

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
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const SavedContext = createContext({});

export function SavedProvider({ children }) {
    const { token } = useAuth();
    const [savedIds, setSavedIds] = useState(new Set());
    const [loading, setLoading] = useState(false);

    const fetchSaved = useCallback(async () => {
        if (!token) { setSavedIds(new Set()); return; }
        setLoading(true);
        try {
            const res = await axios.get('/api/bookmarks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const ids = new Set(res.data.map(o => o.opp_id));
            setSavedIds(ids);
        } catch (err) {
            console.error('Failed to fetch saved opportunities', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Fetch whenever token changes (login/logout)
    useEffect(() => {
        fetchSaved();
    }, [fetchSaved]);

    function markSaved(opp_id) {
        setSavedIds(prev => new Set([...prev, opp_id]));
    }

    function markUnsaved(opp_id) {
        setSavedIds(prev => {
            const next = new Set(prev);
            next.delete(opp_id);
            return next;
        });
    }

    function isSaved(opp_id) {
        return savedIds.has(opp_id);
    }

    return (
        <SavedContext.Provider value={{ isSaved, markSaved, markUnsaved, fetchSaved, loading }}>
            {children}
        </SavedContext.Provider>
    );
}

export function useSaved() {
    return useContext(SavedContext);
}
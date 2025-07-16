import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AddPageVisit from './components/AddPageVisit';
import SearchPages from './components/SearchPages';
import ProtectedRoute from './components/ProtectedRoute';
import { Search, Plus, LogOut, User } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || (() => {
    console.error('❌ VITE_GOOGLE_CLIENT_ID not found in environment variables!');
    console.log('📝 Available env vars:', import.meta.env);
    console.log('💡 Make sure you have created frontend/.env file from frontend/env.template');
    return 'MISSING_GOOGLE_CLIENT_ID';
})();

function MainApp() {
    const [activeTab, setActiveTab] = useState<'add' | 'search'>('search');
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8">
                <header className="flex justify-between items-center mb-8">
                    <div className="text-center flex-1">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">PastTense</h1>
                        <p className="text-gray-600">Semantic Search for Your Web History</p>
                    </div>

                    {user && (
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-gray-700">
                                {user.picture ? (
                                    <img
                                        src={user.picture}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full"
                                    />
                                ) : (
                                    <User className="w-8 h-8" />
                                )}
                                <span className="font-medium">{user.name}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-md transition-colors"
                                title="Sign out"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign out</span>
                            </button>
                        </div>
                    )}
                </header>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="flex">
                                <button
                                    onClick={() => setActiveTab('search')}
                                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === 'search'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Search className="inline-block w-5 h-5 mr-2" />
                                    Search Pages
                                </button>
                                <button
                                    onClick={() => setActiveTab('add')}
                                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === 'add'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Plus className="inline-block w-5 h-5 mr-2" />
                                    Add Page Visit
                                </button>
                            </nav>
                        </div>

                        <div className="p-6">
                            {activeTab === 'search' && <SearchPages />}
                            {activeTab === 'add' && <AddPageVisit />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AuthProvider>
                <ProtectedRoute>
                    <MainApp />
                </ProtectedRoute>
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}

export default App; 
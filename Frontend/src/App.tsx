import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { Home } from './pages/Home';
import { MovieDetail } from './pages/MovieDetail';
import { MyList } from './pages/MyList';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CategoryPage } from './pages/CategoryPage';
import { SearchPage } from './pages/SearchPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { WatchPage } from './pages/WatchPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="title/:id" element={<MovieDetail />} />
                <Route path="watch/:id" element={<WatchPage />} />
                <Route path="my-list" element={
                    <ProtectedRoute>
                        <MyList />
                    </ProtectedRoute>
                } />

                {/* Redirect compatibility routes */}
                <Route path="phim/:slug" element={<MovieDetail />} />
                <Route path="danh-sach/:type" element={<CategoryPage />} />
                <Route path="the-loai/:slug" element={<CategoryPage />} />
                <Route path="tim-kiem" element={<SearchPage />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <FavoritesProvider>
                    <AppRoutes />
                </FavoritesProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;

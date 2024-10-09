import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import LoginForm from './components/auth/Login';
import RegisterForm from './components/auth/Register';
import AdminDashboard from './components/admin/AdminDashboard';
import PrivateRoute from './components/common/PrivateRoute';
import CategoryManagement from "./components/admin/category/CategoryManagement";
import ProductManagement from "./components/admin/product/ProductManagement";
import ProductShowcase from './pages/ProductShowcase';
import UserQuoteManagement from "./pages/UserQuoteManagement";

function AppContent() {
    return (
        <div className="App d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute requiredRoles={['ADMIN', 'SUPER']}>
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/categories"
                        element={
                            <PrivateRoute requiredRoles={['ADMIN', 'SUPER']}>
                                <CategoryManagement />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/products"
                        element={
                            <PrivateRoute requiredRoles={['ADMIN', 'SUPER']}>
                                <ProductManagement />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/products" element={<ProductShowcase />} />
                    <Route path="/quotes" element={<UserQuoteManagement />} />
                    {/* 추가 라우트들... */}
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default AppContent;
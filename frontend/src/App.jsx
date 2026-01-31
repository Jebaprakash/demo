import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProductManagement } from './pages/admin/ProductManagement';
import { OrderManagement } from './pages/admin/OrderManagement';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <Toaster
                        position="bottom-left"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: 'rgba(15, 23, 42, 0.9)',
                                color: '#fff',
                                backdropFilter: 'blur(12px)',
                                borderRadius: '1.5rem',
                                padding: '1rem 1.5rem',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            },
                        }}
                    />

                    <Routes>
                        {/* Admin Routes - Must come BEFORE customer routes */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/products"
                            element={
                                <ProtectedRoute>
                                    <ProductManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/orders"
                            element={
                                <ProtectedRoute>
                                    <OrderManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

                        {/* Customer Routes */}
                        <Route
                            path="/*"
                            element={
                                <>
                                    <Navbar />
                                    <CartDrawer />
                                    <div className="flex flex-col min-h-screen">
                                        <div className="flex-grow">
                                            <Routes>
                                                <Route path="/" element={<HomePage />} />
                                                <Route path="/products" element={<ProductListPage />} />
                                                <Route path="/products/:id" element={<ProductDetailPage />} />
                                                <Route path="/checkout" element={<CheckoutPage />} />
                                                <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                                                <Route path="*" element={<Navigate to="/" replace />} />
                                            </Routes>
                                        </div>
                                        <Footer />
                                    </div>
                                </>
                            }
                        />
                    </Routes>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;

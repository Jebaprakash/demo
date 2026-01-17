import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';

export const Navbar = () => {
    const { getCartCount, toggleCart } = useCart();
    const cartCount = getCartCount();

    return (
        <nav className="glass-effect sticky top-0 z-30 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">MS</span>
                        </div>
                        <span className="text-xl font-bold text-gradient">My Store</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/products"
                            className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                        >
                            Products
                        </Link>
                    </div>

                    {/* Cart Button */}
                    <motion.button
                        onClick={toggleCart}
                        className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                        {cartCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                            >
                                {cartCount}
                            </motion.span>
                        )}
                    </motion.button>
                </div>
            </div>
        </nav>
    );
};

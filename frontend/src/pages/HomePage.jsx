import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { productsAPI } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

export const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                productsAPI.getAll({ sort: 'newest' }),
                productsAPI.getCategories(),
            ]);

            setFeaturedProducts(productsRes.data.data.slice(0, 8));
            setCategories(categoriesRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-16 overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center px-4 pt-20 pb-32">
                {/* Background Decor */}
                <div className="absolute inset-0 overflow-hidden -z-10">
                    <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-primary-200/50 rounded-full blur-3xl animate-blob" />
                    <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-secondary-200/50 rounded-full blur-3xl animate-blob animation-delay-2000" />
                    <div className="absolute bottom-[10%] left-[20%] w-80 h-80 bg-primary-300/30 rounded-full blur-3xl animate-blob animation-delay-4000" />
                </div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center w-full">
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-left"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 mb-6"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-pulse" />
                            <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">New Summer Collection 2024</span>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight text-slate-900">
                            Discover Your <span className="text-gradient">Dynamic</span> Style
                        </h1>
                        <p className="text-lg md:text-xl mb-10 text-slate-600 max-w-xl leading-relaxed">
                            Experience the future of shopping with our curated collection of premium products. Quality meets innovation.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/products">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-primary w-full sm:w-auto"
                                >
                                    Explore Collection
                                </motion.button>
                            </Link>
                            <Link to="/products?category=Electronics">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-secondary w-full sm:w-auto"
                                >
                                    Learn More
                                </motion.button>
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center space-x-8">
                            <div>
                                <h4 className="text-2xl font-bold text-slate-900">50k+</h4>
                                <p className="text-sm text-slate-500 font-medium">Happy Customers</p>
                            </div>
                            <div className="h-10 w-px bg-slate-200" />
                            <div>
                                <h4 className="text-2xl font-bold text-slate-900">24/7</h4>
                                <p className="text-sm text-slate-500 font-medium">Expert Support</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative hidden lg:block"
                    >
                        <motion.div style={{ y: y1 }} className="relative z-10">
                            <img
                                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
                                alt="Featured"
                                className="rounded-[2.5rem] shadow-2xl border-8 border-white animate-float"
                            />
                        </motion.div>
                        <motion.div
                            style={{ y: y2 }}
                            className="absolute -bottom-10 -left-10 z-20 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 max-w-[200px]"
                        >
                            <div className="flex items-center space-x-2 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="font-bold text-slate-900">Fast Delivery</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">Free shipping on all orders over $100</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Categories Section */}
            {categories.length > 0 && (
                <section className="py-24 bg-white relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">
                                Browse <span className="text-gradient">Categories</span>
                            </h2>
                            <p className="text-slate-500 font-medium">Find exactly what you're looking for</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        to={`/products?category=${encodeURIComponent(category)}`}
                                        className="group block p-6 bg-slate-50 rounded-3xl hover:bg-primary-600 transition-all duration-500 text-center"
                                    >
                                        <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-white rounded-2xl group-hover:bg-primary-500 transition-colors shadow-sm">
                                            <svg className="w-6 h-6 text-primary-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-white transition-colors capitalize">
                                            {category}
                                        </h3>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Products Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div className="text-left">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900">
                                Featured <span className="text-gradient">Selection</span>
                            </h2>
                            <p className="text-slate-500 font-medium">Our most popular items this week</p>
                        </div>
                        <Link to="/products">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-secondary"
                            >
                                View All Products
                            </motion.button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <LoadingSkeleton key={i} type="product" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

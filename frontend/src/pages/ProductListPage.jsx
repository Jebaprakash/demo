import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productsAPI } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

export const ProductListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || 'newest',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchCategories = async () => {
        try {
            const res = await productsAPI.getCategories();
            setCategories(res.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.category) params.category = filters.category;
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;
            if (filters.sort) params.sort = filters.sort;

            const res = await productsAPI.getAll(params);
            setProducts(res.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);

        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v) params.set(k, v);
        });
        setSearchParams(params);
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            sort: 'newest',
        });
        setSearchParams({});
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2">
                            Our <span className="text-gradient">Collections</span>
                        </h1>
                        <p className="text-slate-500 font-medium">Explore our wide range of premium products</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 shadow-sm hover:shadow-md transition-all lg:hidden"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            Filters
                        </motion.button>

                        <div className="relative flex-1 md:flex-none">
                            <select
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                                className="w-full md:w-48 appearance-none px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 shadow-sm outline-none focus:border-primary-500 transition-all cursor-pointer"
                            >
                                <option value="newest">Sort: Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <aside className={`lg:w-72 space-y-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                            <div className="space-y-8">
                                {/* Search */}
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Search</h3>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={filters.search}
                                            onChange={(e) => handleFilterChange('search', e.target.value)}
                                            placeholder="Find products..."
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-primary-500 transition-all outline-none text-sm font-medium"
                                        />
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Categories</h3>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => handleFilterChange('category', '')}
                                            className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-all ${filters.category === '' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            All Categories
                                        </button>
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => handleFilterChange('category', cat)}
                                                className={`w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-all capitalize ${filters.category === cat ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Price Range</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="number"
                                            value={filters.minPrice}
                                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                            placeholder="Min"
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold focus:bg-white focus:ring-2 focus:ring-primary-100"
                                        />
                                        <input
                                            type="number"
                                            value={filters.maxPrice}
                                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                            placeholder="Max"
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-bold focus:bg-white focus:ring-2 focus:ring-primary-100"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={clearFilters}
                                    className="w-full py-3 text-sm font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <LoadingSkeleton key={i} type="product" />
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">No products found</h3>
                                <p className="text-slate-500 font-medium mb-8">Try adjusting your search or filters</p>
                                <button onClick={clearFilters} className="btn-primary">
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                <AnimatePresence mode='popLayout'>
                                    {products.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.4, delay: index * 0.05 }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

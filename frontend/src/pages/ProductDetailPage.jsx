import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { getImageUrl } from '../utils/url';
import toast from 'react-hot-toast';

export const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await productsAPI.getById(id);
            setProduct(res.data.data);
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Failed to load product');
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);
            toast.success(`Added ${quantity} ${product.name} to cart!`);
            setQuantity(1);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <LoadingSkeleton type="detail" />
                </div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-8 font-bold transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow group-hover:bg-primary-50 transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                    Back to Collection
                </motion.button>

                <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12">
                        {/* Image Gallery */}
                        <div className="space-y-6">
                            <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 group">
                                <AnimatePresence mode='wait'>
                                    <motion.img
                                        key={selectedImage}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.5 }}
                                        src={getImageUrl(product.images[selectedImage])}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </AnimatePresence>
                                <div className="absolute top-6 left-6">
                                    <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest text-primary-600 shadow-xl border border-white/50">
                                        {product.category}
                                    </span>
                                </div>
                            </div>

                            {product.images.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                                    {product.images.map((image, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative min-w-[100px] h-[100px] rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === index
                                                ? 'border-primary-500 shadow-lg ring-4 ring-primary-50'
                                                : 'border-slate-100 hover:border-primary-200'
                                                }`}
                                        >
                                            <img
                                                src={getImageUrl(image)}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col h-full">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-6 mb-8">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Premium Price</span>
                                        <span className="text-4xl font-black text-slate-900">
                                            ₹{product.price.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-12 w-px bg-slate-100" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Availability</span>
                                        {product.stockQty > 0 ? (
                                            <span className="text-green-600 font-bold flex items-center gap-1">
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                In Stock ({product.stockQty})
                                            </span>
                                        ) : (
                                            <span className="text-red-500 font-bold">Out of Stock</span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 mb-10">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Description</h3>
                                    <p className="text-slate-600 leading-relaxed text-lg font-medium">
                                        {product.description}
                                    </p>
                                </div>

                                {product.stockQty > 0 ? (
                                    <div className="space-y-8 mt-auto">
                                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Quantity</h3>
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center p-1 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                                    <motion.button
                                                        whileTap={{ scale: 0.8 }}
                                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                        className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                                                        </svg>
                                                    </motion.button>
                                                    <span className="text-2xl font-black text-slate-900 w-12 text-center select-none">
                                                        {quantity}
                                                    </span>
                                                    <motion.button
                                                        whileTap={{ scale: 0.8 }}
                                                        onClick={() => setQuantity(Math.min(product.stockQty, quantity + 1))}
                                                        className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    </motion.button>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-slate-400 font-bold uppercase">Total Price</p>
                                                    <p className="text-xl font-black text-slate-900">₹{(product.price * quantity).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <motion.button
                                            onClick={handleAddToCart}
                                            whileHover={{ y: -4, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-slate-900 text-white rounded-2xl py-6 font-black text-lg tracking-widest shadow-2xl shadow-slate-900/20 hover:bg-primary-600 hover:shadow-primary-500/40 transition-all flex items-center justify-center gap-3 uppercase"
                                        >
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            Add to Bag
                                        </motion.button>
                                    </div>
                                ) : (
                                    <div className="mt-auto p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-center">
                                        <p className="text-slate-500 font-bold text-lg mb-2">Currently Unavailable</p>
                                        <p className="text-sm text-slate-400">Join our waitlist to get notified when this returns.</p>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

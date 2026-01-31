import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { getImageUrl } from '../utils/url';

export const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product, 1);
    };

    const handleCardClick = () => {
        navigate(`/products/${product.id}`);
    };

    const imageUrl = getImageUrl(product.images?.[0]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] border border-slate-100 h-full"
            onClick={handleCardClick}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
                <motion.img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Badges */}
                <div className="absolute top-5 left-5 flex flex-col gap-2">
                    {product.stockQty === 0 ? (
                        <span className="px-3 py-1.5 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                            Out of Stock
                        </span>
                    ) : product.stockQty < 10 && (
                        <span className="px-3 py-1.5 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                            Last {product.stockQty} left
                        </span>
                    )}
                </div>

                <div className="absolute top-5 right-5">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-md border border-slate-100">
                        {product.category}
                    </span>
                </div>

                {/* Quick Add Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 group-hover:bg-slate-900/10 transition-all duration-500">
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all duration-300"
                        onClick={handleAddToCart}
                        disabled={product.stockQty === 0}
                    >
                        {product.stockQty === 0 ? 'Unavailable' : 'Quick Add +'}
                    </motion.button>
                </div>
            </div>

            {/* Content Container */}
            <div className="p-8 flex flex-col flex-grow">
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em]">
                            {product.category}
                        </span>
                        <div className="flex items-center space-x-1">
                            <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-[10px] font-black text-slate-400">4.8</span>
                        </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-primary-600 transition-colors duration-300 line-clamp-1">
                        {product.name}
                    </h3>
                </div>

                <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6 leading-relaxed">
                    {product.description}
                </p>

                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">
                            ₹{product.price.toLocaleString()}
                        </span>
                    </div>
                    <motion.button
                        whileHover={{ x: 5 }}
                        className="text-primary-600 p-2"
                        onClick={handleCardClick}
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};


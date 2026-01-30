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
            className="card-premium cursor-pointer group"
            onClick={handleCardClick}
            whileHover={{ y: -12 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                <motion.img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700"
                    whileHover={{ scale: 1.15 }}
                />

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {product.stockQty === 0 ? (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-bold shadow-xl">Out of Stock</span>
                    </div>
                ) : (
                    product.stockQty < 10 && (
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                Only {product.stockQty} left
                            </span>
                        </div>
                    )
                )}

                <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-primary-600 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg border border-slate-100">
                        {product.category}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {product.name}
                </h3>

                <p className="text-xs text-slate-400 font-medium mb-4 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Price</span>
                        <span className="text-2xl font-black text-slate-900">
                            ₹{product.price.toLocaleString()}
                        </span>
                    </div>
                </div>

                <motion.button
                    onClick={handleAddToCart}
                    disabled={product.stockQty === 0}
                    className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-lg ${product.stockQty === 0
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                            : 'bg-slate-900 text-white hover:bg-primary-600 hover:shadow-primary-500/30'
                        }`}
                    whileTap={{ scale: 0.95 }}
                >
                    {product.stockQty === 0 ? 'NOT AVAILABLE' : 'ADD TO CART'}
                </motion.button>
            </div>
        </motion.div>
    );
};

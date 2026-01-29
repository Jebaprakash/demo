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
            className="card cursor-pointer group"
            onClick={handleCardClick}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
        >
            <div className="relative overflow-hidden">
                <motion.img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                />
                {product.stockQty === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="badge-danger text-lg font-bold">Out of Stock</span>
                    </div>
                )}
                {product.stockQty > 0 && product.stockQty < 10 && (
                    <div className="absolute top-4 right-4">
                        <span className="badge-warning">Only {product.stockQty} left</span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gradient">
                        ₹{product.price.toLocaleString()}
                    </span>
                    <span className="badge-info">{product.category}</span>
                </div>

                <motion.button
                    onClick={handleAddToCart}
                    disabled={product.stockQty === 0}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${product.stockQty === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'btn-primary'
                        }`}
                    whileTap={{ scale: 0.95 }}
                >
                    {product.stockQty === 0 ? 'Out of Stock' : 'Add to Cart'}
                </motion.button>
            </div>
        </motion.div>
    );
};

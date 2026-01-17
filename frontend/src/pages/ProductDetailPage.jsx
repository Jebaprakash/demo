import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
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
            setQuantity(1);
        }
    };

    const getImageUrl = (imagePath) => {
        return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${imagePath}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <LoadingSkeleton type="detail" />
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-primary-600 mb-6 font-medium"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Products
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Image Gallery */}
                        <div>
                            <motion.div
                                key={selectedImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100"
                            >
                                <img
                                    src={getImageUrl(product.images[selectedImage])}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>

                            {product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                                    ? 'border-primary-500 ring-2 ring-primary-200'
                                                    : 'border-gray-200 hover:border-primary-300'
                                                }`}
                                        >
                                            <img
                                                src={getImageUrl(image)}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            <div className="mb-4">
                                <span className="badge-info">{product.category}</span>
                            </div>

                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-4xl font-bold text-gradient">
                                    ₹{product.price.toLocaleString()}
                                </span>
                                {product.stockQty > 0 ? (
                                    <span className="badge-success">In Stock ({product.stockQty} available)</span>
                                ) : (
                                    <span className="badge-danger">Out of Stock</span>
                                )}
                            </div>

                            <div className="prose prose-lg mb-8">
                                <p className="text-gray-700">{product.description}</p>
                            </div>

                            {product.stockQty > 0 && (
                                <div className="space-y-6">
                                    {/* Quantity Selector */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Quantity
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-xl"
                                            >
                                                -
                                            </button>
                                            <span className="text-2xl font-bold w-16 text-center">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(Math.min(product.stockQty, quantity + 1))}
                                                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-xl"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <motion.button
                                        onClick={handleAddToCart}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full btn-primary text-lg py-4"
                                    >
                                        Add to Cart
                                    </motion.button>
                                </div>
                            )}

                            {product.stockQty === 0 && (
                                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
                                    <p className="text-red-800 font-semibold">
                                        This product is currently out of stock
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

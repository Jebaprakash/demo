import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { ordersAPI } from '../services/api';
import { generateUPIString } from '../utils/qrGenerator';
import { generateWhatsAppMessage } from '../utils/whatsappHelper';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';

export const OrderSuccessPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const res = await ordersAPI.getById(orderId);
            setOrder(res.data.data);
        } catch (error) {
            console.error('Error fetching order:', error);
            toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentConfirmation = async () => {
        try {
            await ordersAPI.updatePaymentStatus(orderId, 'PendingVerification');
            setPaymentConfirmed(true);
            toast.success('Payment confirmation received! We will verify and update your order.');
        } catch (error) {
            console.error('Error updating payment status:', error);
            toast.error('Failed to confirm payment');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto px-4">
                    <LoadingSkeleton type="detail" />
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 py-16">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
                    <Link to="/products" className="mt-6 btn-primary inline-block">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const upiString = generateUPIString(order.id, order.totalAmount);
    const whatsappUrl = generateWhatsAppMessage(order);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-xl shadow-lg p-8"
                >
                    {/* Success Icon */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4"
                        >
                            <svg
                                className="w-12 h-12 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </motion.div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
                        <p className="text-gray-600">Thank you for your order</p>
                    </div>

                    {/* Order Details */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-600">Order ID</p>
                                <p className="font-bold text-gray-900">{order.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Payment Method</p>
                                <p className="font-bold text-gray-900">{order.paymentMethod}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Amount</p>
                                <p className="font-bold text-primary-600 text-xl">
                                    ₹{order.totalAmount.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Order Status</p>
                                <span className="badge-warning">{order.orderStatus}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <p className="text-sm text-gray-600 mb-2">Delivery Address</p>
                            <p className="font-medium text-gray-900">
                                {order.customer.name}<br />
                                {order.customer.phone}<br />
                                {order.customer.address}, {order.customer.city} - {order.customer.pincode}
                            </p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                        <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
                        <div className="space-y-3">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                                    </div>
                                    <p className="font-bold text-primary-600">
                                        ₹{(item.price * item.qty).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* QR Payment Section */}
                    {order.paymentMethod === 'QR' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-6 mb-6"
                        >
                            <h3 className="font-bold text-gray-900 mb-4 text-center text-xl">
                                Complete Your Payment
                            </h3>

                            <div className="flex flex-col items-center">
                                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                                    <QRCodeSVG value={upiString} size={200} />
                                </div>

                                <p className="text-center text-gray-700 mb-4">
                                    Scan this QR code with any UPI app to complete payment
                                </p>

                                {!paymentConfirmed ? (
                                    <motion.button
                                        onClick={handlePaymentConfirmation}
                                        whileTap={{ scale: 0.95 }}
                                        className="btn-primary"
                                    >
                                        I Have Paid
                                    </motion.button>
                                ) : (
                                    <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg font-semibold">
                                        ✓ Payment confirmation received
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* WhatsApp Confirmation */}
                    <div className="text-center mb-6">
                        <p className="text-gray-700 mb-4">
                            Send order confirmation via WhatsApp
                        </p>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Send via WhatsApp
                        </a>
                    </div>

                    {/* Continue Shopping */}
                    <div className="text-center pt-6 border-t border-gray-200">
                        <Link to="/products">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-secondary"
                            >
                                Continue Shopping
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

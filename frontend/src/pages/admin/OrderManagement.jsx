import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const OrderManagement = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const statusFilter = searchParams.get('status') || '';
    const paymentFilter = searchParams.get('paymentStatus') || '';

    useEffect(() => {
        fetchOrders();
    }, [statusFilter, paymentFilter]);

    const fetchOrders = async () => {
        try {
            const params = {};
            if (statusFilter) params.status = statusFilter;
            if (paymentFilter) params.paymentStatus = paymentFilter;

            const res = await adminAPI.getAllOrders(params);
            setOrders(res.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, field, value) => {
        try {
            await adminAPI.updateOrder(orderId, { [field]: value });
            toast.success('Order updated successfully');
            fetchOrders();
            if (selectedOrder && selectedOrder.id === orderId) {
                const res = await adminAPI.getAllOrders();
                const updated = res.data.data.find(o => o.id === orderId);
                setSelectedOrder(updated);
            }
        } catch (error) {
            console.error('Error updating order:', error);
            toast.error('Failed to update order');
        }
    };

    return (
        <AdminLayout>
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Orders</h1>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Order Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    const params = new URLSearchParams(searchParams);
                                    if (e.target.value) {
                                        params.set('status', e.target.value);
                                    } else {
                                        params.delete('status');
                                    }
                                    setSearchParams(params);
                                }}
                                className="input-field"
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Payment Status
                            </label>
                            <select
                                value={paymentFilter}
                                onChange={(e) => {
                                    const params = new URLSearchParams(searchParams);
                                    if (e.target.value) {
                                        params.set('paymentStatus', e.target.value);
                                    } else {
                                        params.delete('paymentStatus');
                                    }
                                    setSearchParams(params);
                                }}
                                className="input-field"
                            >
                                <option value="">All Payment Statuses</option>
                                <option value="Unpaid">Unpaid</option>
                                <option value="PendingVerification">Pending Verification</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton h-24 rounded-xl"></div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <p className="text-gray-600 text-lg">No orders found</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Items</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Payment</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-mono text-sm text-gray-900">{order.id.slice(-8)}</p>
                                            <p className="text-xs text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">{order.customer.name}</p>
                                            <p className="text-sm text-gray-600">{order.customer.phone}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="badge-info">{order.items.length} items</span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            ₹{order.totalAmount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="mb-1">
                                                <span className="badge-info text-xs">{order.paymentMethod}</span>
                                            </div>
                                            <select
                                                value={order.paymentStatus}
                                                onChange={(e) => handleStatusUpdate(order.id, 'paymentStatus', e.target.value)}
                                                className="text-xs border border-gray-300 rounded px-2 py-1"
                                            >
                                                <option value="Unpaid">Unpaid</option>
                                                <option value="PendingVerification">Pending</option>
                                                <option value="Paid">Paid</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusUpdate(order.id, 'orderStatus', e.target.value)}
                                                className="text-sm border border-gray-300 rounded px-3 py-1 font-medium"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-primary-600 hover:text-primary-700 font-medium"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Order Details Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm text-gray-600">Order ID</p>
                                        <p className="font-mono font-semibold">{selectedOrder.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Date</p>
                                        <p className="font-semibold">
                                            {new Date(selectedOrder.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Payment Method</p>
                                        <p className="font-semibold">{selectedOrder.paymentMethod}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="font-bold text-primary-600 text-xl">
                                            ₹{selectedOrder.totalAmount.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-900 mb-3">Customer Details</h3>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="font-semibold">{selectedOrder.customer.name}</p>
                                        <p className="text-gray-700">{selectedOrder.customer.phone}</p>
                                        <p className="text-gray-700 mt-2">
                                            {selectedOrder.customer.address}<br />
                                            {selectedOrder.customer.city} - {selectedOrder.customer.pincode}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-900 mb-3">Order Items</h3>
                                    <div className="space-y-2">
                                        {selectedOrder.items.map((item, index) => (
                                            <div key={index} className="flex justify-between p-3 bg-gray-50 rounded-lg">
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
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

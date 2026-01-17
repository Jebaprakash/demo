export const generateWhatsAppMessage = (order) => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+91XXXXXXXXXX';

    let message = `*New Order Confirmation*\n\n`;
    message += `*Order ID:* ${order.id}\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${order.customer.name}\n`;
    message += `Phone: ${order.customer.phone}\n`;
    message += `Address: ${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}\n\n`;
    message += `*Order Items:*\n`;

    order.items.forEach((item, index) => {
        message += `${index + 1}. ${item.name} x ${item.qty} = ₹${item.price * item.qty}\n`;
    });

    message += `\n*Total Amount:* ₹${order.totalAmount}\n`;
    message += `*Payment Method:* ${order.paymentMethod}\n`;
    message += `*Payment Status:* ${order.paymentStatus}\n`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
};

const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const Product = require('../models/Product');

exports.createOrder = async (products) => {
    let totalPrice = 0;

    for (const item of products) {
        const product = await Product.findByPk(item.productId);
        if (!product || product.stock < item.quantity) {
            throw new Error(`Stock insuficiente para el producto con ID ${item.productId}`);
        }
        totalPrice += product.price * item.quantity;
    }

    const order = await Order.create({ totalPrice });

    for (const item of products) {
        const product = await Product.findByPk(item.productId);
        await OrderDetail.create({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
        });

        await product.update({ stock: product.stock - item.quantity });
    }

    return order;
};

exports.getOrderById = async (id) => {
    return await Order.findByPk(id, {
        include: [{ model: OrderDetail, include: [Product] }],
    });
};

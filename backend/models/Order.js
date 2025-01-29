const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Order = sequelize.define('Order', {
    totalPrice: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, completed, cancelled
});


// Relación: Un usuario puede tener muchas órdenes, pero una orden pertenece a un usuario
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });console.log('Order model defined');
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });


module.exports = Order;

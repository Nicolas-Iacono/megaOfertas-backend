const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const Address= require('../models/userInfo/Address');
const Phone = require('../models/userInfo/Phone');
const Authorities = require('../models/userInfo/Authorities');
exports.getAllUsers = async () => {
    try {
        const users = await User.findAll({
          include: [
            { model: Address, as: 'address' },
            { model: Phone, as: 'phone' },
            { model: Authorities, as: 'authorities' } 
          ]
        });
        return users;
      } catch (error) {
        throw error;
      }
    };

    exports.getUserById = async (id) => {
        try {
          const user = await User.findByPk(id, {
            include: [
              { model: Address, as: 'address' },
              { model: Phone, as: 'phone' },
              { model: Authorities, as: 'authorities' } 
            ]
          });
      
          return user; // Devolvemos el usuario encontrado
        } catch (error) {
          throw error; // Lanzamos el error para manejarlo en otro lugar
        }
      };

exports.createUser = async (userData) => {
    try{

    
    // Hash de la contraseña antes de guardar el usuario
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

   const user = await User.create(userData);

    const payload = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });
    return {
        user,
        token,
    };
        }catch(error){
            throw new Error("Error al crear el usuario: " + error.message);
        }
    }

exports.updateUser = async (id, userData) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error('Usuario no encontrado');

    if (userData.password) {
        // Si se proporciona una nueva contraseña, se hashea
        userData.password = await bcrypt.hash(userData.password, 10);
    }

    return await user.update(userData);
};

exports.deleteUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user) throw new Error('Usuario no encontrado');

    await user.destroy();
    return { message: 'Usuario eliminado con éxito' };
};

exports.findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({
            where: { email },
            include: {
                model: Authorities,
                as: 'authorities', // Verifica que este alias coincida con el modelo
                attributes: ['role'],
            },
        });
        console.log('Usuario encontrado:', user);
        return user;
    } catch (error) {
        console.error('Error en findUserByEmail:', error);
        throw new Error('Error al buscar usuario');
    }
};


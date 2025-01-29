const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/userController');

// Registro de administrador
router.post('/register', userController.createUserWithRelations);

router.post('/register-admin', userController.createAdminWithRelations);

// Inicio de sesión de administrador
router.post('/login', userController.loginUser);

router.get('/all', userController.getAllUsers)
module.exports = router;
router.delete('/delete/:id', userController.deleteUser)
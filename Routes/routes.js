const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const medicinesController = require('../controllers/medicineController');

// controlador de farmacia
const { 
    getAllFarma,
    formFarmacia,
    createFarma,
    buscarFarmacia,
    formEditarFarma,
    updateFarma,
    deleteFarma
} = require('../controllers/farmaController')
const {isAuthenticated} = require('../Middleware/authMiddleware');



// Controlador de productos
const {
    listarProductos,
    formularioNuevo,
    crearProducto,
    mostrarProductos,
    BuscarProductos,
    formularioEditar,
    actualizarProducto,
    eliminarProducto,
    reabastecerProductoAjax
}  = require('../controllers/productoController');




const {
    Admin
} = require('../controllers/adminController')


const RouterPrincipal = () => {

    router.get('/admin', isAuthenticated, Admin);

    
    router.get('/register', userController.formRegister);
    router.post('/user/register', userController.register);
    


    //Rutas de Medicinas
    router.get('/medicinas/Allmedicine', medicinesController.getAllMedicines);

    // Farmacias - recuerda que la ruta debe llevar farma
    router.get('/farmacias', isAuthenticated, getAllFarma);
    router.get('/buscar', isAuthenticated, buscarFarmacia);
    router.get('/nuevaFarmacia', isAuthenticated, formFarmacia);
    router.post('/crearFarmacia', isAuthenticated, createFarma);
    router.get('/farmacia/:id', isAuthenticated, formEditarFarma);
    router.post('/farmacia/:id', isAuthenticated, updateFarma);
    router.post('/eliminar/:id', isAuthenticated, deleteFarma);

    //Productos
    router.get('/productos/:farmaciaId', isAuthenticated, listarProductos);
    router.get('/nuevoProducto/:farmaciaId', isAuthenticated, formularioNuevo);
    router.post('/productos/crear', isAuthenticated, crearProducto);
    router.get('/productos', isAuthenticated, mostrarProductos);
    router.get('/buscarProducto', isAuthenticated, BuscarProductos);
    router.get('/editarProducto/:id', isAuthenticated, formularioEditar);
    router.post('/updateProducto/:id', isAuthenticated, actualizarProducto);
    router.post('/eliminarProducto/:id', isAuthenticated, eliminarProducto);
    router.post('/reabastecer/:id', isAuthenticated, reabastecerProductoAjax);



    
    // Login inicio de sesion usuario
    router.get('/login', authController.login);
    router.post('/login', authController.postLogin);




    // Logout
    router.get('/logout', authController.logout);


    return router;
}

module.exports = RouterPrincipal;



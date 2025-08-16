const express = require('express');
const router = express.Router();

const {Public,
     catalogoPublico,
    } = require('../controllers/PublicController');

const {
    verCarrito,
    agregarCarrito,
    eliminarCarrito,
    finalizarCompra
    
} = require('../controllers/carritoController');


const {
    listarOrdenes,
    detalleOrden,
    cambiarEstado
} = require('../controllers/adminOrdenController')

const { isAuthenticated } = require('../Middleware/authMiddleware');



const PublicRoute = () => {
    
    // publica
    router.get('/tienda', Public);  
    router.get('/productos', catalogoPublico);

    // carrito
    router.get('/carrito', isAuthenticated, verCarrito);
    router.post('/agregarCarrito', agregarCarrito);
    router.post('/eliminarCarrito/:id', isAuthenticated, eliminarCarrito);
    router.post('/finalizarCompra', isAuthenticated, finalizarCompra);
    

    //ordenes
    router.get('/ordenes', isAuthenticated, listarOrdenes);
    router.get('/detalleOrden/:id', isAuthenticated, detalleOrden);
    router.post('/cambiarEstado/:id', isAuthenticated, cambiarEstado);

 
    return router;
}


module.exports = PublicRoute
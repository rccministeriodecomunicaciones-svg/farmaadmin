

const Producto = require('../models/productModel');
const Farmacia = require('../models/FarmaModel');
const { Op } = require('sequelize');


exports.Public = async (req, res) => {
  const buscar = req.query.buscar || '';
  const farmaciaSeleccionada = req.query.farmacia || '';

  const where = {};
  if (buscar) {
    where.nombre = { [Op.iLike]: `%${buscar}%` };
  }
  if (farmaciaSeleccionada) {
    where.farmaciaId = farmaciaSeleccionada;
  }

  try {
    const productos = await Producto.findAll({
      where,
      include: {
        model: Farmacia,
        attributes: ['nombre']
      }
    });

    const farmacias = await Farmacia.findAll({ attributes: ['id', 'nombre'] });

    res.render('Tienda/tienda', {
      productos,
      farmacias,
      buscar,
      farmaciaSeleccionada,
      nombrePagina: 'Catálogo de Productos',
      session: req.session
    });
  } catch (error) {
    console.error('Error en catálogo público:', error);
    res.status(500).send('Error del servidor');
  }
}





exports.catalogoPublico = async (req, res) => {
  const buscar = req.query.buscar || '';
  const farmaciaSeleccionada = req.query.farmacia || '';

  const where = {};
  if (buscar) {
    where.nombre = { [Op.iLike]: `%${buscar}%` };
  }
  if (farmaciaSeleccionada) {
    where.farmaciaId = farmaciaSeleccionada;
  }

  try {
    const productos = await Producto.findAll({
      where,
      include: {
        model: Farmacia,
        attributes: ['nombre']
      }
    });

    const farmacias = await Farmacia.findAll({ attributes: ['id', 'nombre'] });

    res.render('Tienda/tienda', {
      productos,
      farmacias,
      buscar,
      farmaciaSeleccionada,
      nombrePagina: 'Catálogo de Productos'
    });
  } catch (error) {
    console.error('Error en catálogo público:', error);
    res.status(500).send('Error del servidor');
  }
};






exports.agregarCarrito = async (req, res) => {

    if (!req.session.user) {
    return res.redirect('/farma/login?mensaje=Debes iniciar sesión para agregar productos');
  }

  const { productoId, cantidad } = req.body;

  try {
    const producto = await Producto.findByPk(productoId);
    console.log(producto);
    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }

    if (!req.session.carrito) {
      req.session.carrito = [];
    }

    const carrito = req.session.carrito;
    console.log(carrito);
    // Verificar si ya está en el carrito
    const existente = carrito.find(item => item.id === producto.id);

    if (existente) {
      existente.cantidad += parseInt(cantidad);
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: parseFloat(producto.precio),
        cantidad: parseInt(cantidad)
      });
    }

    // 💡 Solución: guarda manualmente la sesión
    req.session.save(err => {
      if (err) {
        console.error('Error al guardar la sesión:', err);
      }

      res.redirect('/Public/carrito');
    });

  } catch (err) {
    console.error('Error al agregar al carrito:', err);
    res.status(500).send('Error interno del servidor');
  }
};





exports.carrito = (req, res) => {
  const carrito = req.session.carrito || [];

  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  res.render('partials/carrito', {
    nombrePagina: 'Carrito de Compras',
    carrito,
    total
  });
};


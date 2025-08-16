// controllers/adminOrdenController.js
const Orden = require('../models/orderModel');
const DetalleOrden = require('../models/orderDetailsModel');
const Usuario = require('../models/userModel');
const Producto = require('../models/productModel');



exports.listarOrdenes = async (req, res) => {
  try {
    const { estado } = req.query;
    let where = {};
    if (estado) where.estado = estado;

      const ordenes = await Orden.findAll({
          where,
          include: [{ model: Usuario, as: 'usuario', attributes: ['username', 'email'] }],
          order: [['createdAt', 'DESC']]
      });

    console.log(ordenes);
    res.render('admin/ordenes', { ordenes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar órdenes');
  }
};

exports.detalleOrden = async (req, res) => {
  try {
    const { id } = req.params;

    const orden = await Orden.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['username', 'email']
        }
      ]
    });

    const detalles = await DetalleOrden.findAll({
      where: { ordenId: id },
      include: [{ model: Producto, attributes: ['nombre', 'precio'] }]
    });

    // 🔹 Asegurar que el precio sea número
    const detallesFormateados = detalles.map(d => ({
      ...d.toJSON(),
      Producto: {
        ...d.Producto,
        precio: Number(d.Producto.precio) // convertir a número
      }
    }));

    // 🔹 Calcular total ya con número
    const total = detallesFormateados.reduce((acc, d) => {
      return acc + (d.cantidad * d.Producto.precio);
    }, 0);

    res.render('Ordenes/detalleOrden', { orden, detalles: detallesFormateados, total });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar detalles de la orden');
  }
};






exports.cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoEstado } = req.body;

    const orden = await Orden.findByPk(id);
    if (!orden) {
      return res.status(404).send('Orden no encontrada');
    }

    orden.estado = nuevoEstado;
    await orden.save();

    res.redirect(`/Public/detalleOrden/${id}`); // Redirige al detalle
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cambiar estado');
  }
};


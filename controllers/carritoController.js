const Carrito = require('../models/carritoModel')
const Producto = require('../models/productModel')
const sequelize = require('../config/dbPostgresSQL')
const { fn, col, literal } = require('sequelize');
const Orden = require('../models/orderModel')
const OrdenDetalle = require('../models/orderDetailsModel')



exports.agregarCarrito = async (req, res) => {
  const usuarioId = req.session.user.id;
  const productoId = req.body.productoId;
  const farmaciaId = req.body.farmaciaId;
  const cantidad = parseInt(req.body.cantidad || 1);

  try {
    // 🔍 Buscar el producto y verificar stock
    const producto = await Producto.findByPk(productoId);

    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }

    if (producto.stock < cantidad) {
      return res.status(400).send('No hay suficiente stock disponible');
    }

    // 🔍 Verifica si ya existe el producto en el carrito pendiente
    const existente = await Carrito.findOne({
      where: { usuarioId, productoId, farmaciaId, estado: 'pendiente' }
    });

    if (existente) {
      // Evita que la suma supere el stock
      if (producto.stock < existente.cantidad + cantidad) {
        return res.status(400).send('No hay suficiente stock para esta cantidad');
      }
      existente.cantidad += cantidad;
      await existente.save();
    } else {
      await Carrito.create({ usuarioId, productoId, farmaciaId, cantidad });
    }

    res.redirect('/Public/carrito');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al agregar al carrito');
  }
};





exports.verCarrito = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const usuario = req.session.user.id;

  try {
    // 1️⃣ Traer el detalle
    const carrito = await Carrito.findAll({ 
      where: { 
        usuarioId: usuario,  
        estado: 'pendiente' 
      },
      include: ['Producto']
    });

    // 2️⃣ Consulta SQL directa para el total
    const [resultado] = await sequelize.query(`
      SELECT COALESCE(SUM(c.cantidad * p.precio), 0) AS total_general
      FROM farma."Carritos" c
      JOIN farma."productos" p 
        ON c."productoId" = p.id
      WHERE c."usuarioId" = ${usuario}
        AND c.estado = 'pendiente'
    `);

    const totalFormateado = parseFloat(resultado[0].total_general).toFixed(2);
    console.log(totalFormateado);
    res.render('partials/carrito', { 
      carrito,
      nombrePagina: 'Carrito de Compras',
      totalFormateado
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener el carrito');
  }
};



/// eliminar carrito
exports.eliminarCarrito = async (req, res) => {
  const carritoId = req.params.id;
  try {
    await Carrito.destroy({ where: { id: carritoId } });
    res.redirect('/Public/carrito');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar el carrito');
  }
};




// finalizar la compra 
exports.finalizarCompra = async (req, res) => {
  const usuarioId = req.session.user.id;

  const t = await sequelize.transaction();

  try {
    // 1️⃣ Obtener y bloquear los carritos pendientes del usuario
    const carritos = await Carrito.findAll({
      where: { usuarioId, estado: 'pendiente' },
      include: [{
        model: Producto,
        required: true // ✅ INNER JOIN para evitar error FOR UPDATE
      }],
      lock: true,
      transaction: t
    });

    if (carritos.length === 0) {
      await t.rollback();
      return res.status(400).send('No hay productos en el carrito.');
    }

    // 2️⃣ Validar stock antes de seguir
    for (const item of carritos) {
      if (item.Producto.stock < item.cantidad) {
        await t.rollback();
        return res.status(400).send(`No hay stock suficiente para el producto: ${item.Producto.nombre}`);
      }
    }

    // 3️⃣ Crear la orden
    const orden = await Orden.create({
      usuarioId,
      estado: 'pendiente',
      total: 0 // lo calcularemos después
    }, { transaction: t });

    let totalOrden = 0;

    // 4️⃣ Crear los detalles de la orden y actualizar stock
    for (const item of carritos) {
      const subtotal = item.cantidad * item.Producto.precio;
      totalOrden += subtotal;

      await OrdenDetalle.create({
        ordenId: orden.id,
        productoId: item.productoId,
        cantidad: item.cantidad,
        precioUnitario: item.Producto.precio
      }, { transaction: t });

      await item.Producto.update(
        { stock: item.Producto.stock - item.cantidad },
        { transaction: t }
      );

      // Cambiar estado del carrito
      await item.update({ estado: 'comprado' }, { transaction: t });
    }

    // 5️⃣ Actualizar total de la orden
    await orden.update({ total: totalOrden }, { transaction: t });

    // 6️⃣ Confirmar transacción
    await t.commit();

    res.redirect('/Public/carrito');

  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).send('Error al finalizar la compra.');
  }
};





const Producto = require('../models/productModel');
const Farmacia = require('../models/FarmaModel');

const { Op } = require('sequelize');




// Mostrar productos por farmacia
exports.listarProductos = async (req, res) => {
  const { farmaciaId } = req.params;
  try {
    const farmacia = await Farmacia.findByPk(farmaciaId, {
      include: Producto        
    });

    if (!farmacia) {
      return res.status(404).send('Farmacia no encontrada');
    }

    res.render('Productos/ListarProductos', {
      farmacia,
      productos: farmacia.Productos,
      nombrePagina: 'Productos'
    });

    console.log(farmacia.Productos);
   

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener productos');
  }
};


/// mostrar tabla de productos
exports.mostrarProductos = async (req, res) => {


  
  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const offset = (page - 1) * limit;
  const search = req.query.q || '';

  try {
    const { count, rows: productos } = await Producto.findAndCountAll({
      where: {
        nombre: {
          [Op.iLike]: `%${search}%`
        }
      },
      include: {
        model: Farmacia,
        attributes: ['nombre']
      },
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

    res.render('Productos/allProducts', {
      productos,
      currentPage: page,
      totalPages,
      search,
      nombrePagina: 'Todos los Productos'
    });
  } catch (error) {
    console.error('Error al listar todos los productos:', error);
    res.status(500).send('Error del servidor');
  }
};


// buscar productos
exports.BuscarProductos = async (req, res) => {


    
}






// Mostrar formulario de nuevo producto
exports.formularioNuevo = async (req, res) => {
    try {
    const { farmaciaId } = req.params;
    const farmacias = await Farmacia.findAll();
    res.render('productos/nuevoProducto', {
    farmaciaId,
    farmacias,
    nombrePagina: 'Nuevo Producto'
  });
  } catch (error) {
    console.error('Error al cargar el formulario:', error);
    res.status(500).send('Error al cargar el formulario de creación de producto');
  }
};







// Crear nuevo producto
exports.crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, stock, farmaciaId  } = req.body;
  //const { farmaciaId } = req.params;

  try {
    await Producto.create({
      nombre,
      descripcion,
      stock,
      precio,
      farmaciaId
    });

    res.redirect(`/farma/productos/${farmaciaId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear producto');
  }
};





// Mostrar formulario de edición
exports.formularioEditar = async (req, res) => {
 const { id } = req.params;

  try {
    const producto = await Producto.findByPk(id, {
      include: { model: Farmacia, attributes: ['id', 'nombre'] }
    });

    const farmacias = await Farmacia.findAll();

    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }

    res.render('Productos/editarProducto', {
      producto,
      farmacias,
      nombrePagina: 'Editar Producto'
    });
  } catch (error) {
    console.error('Error al cargar el formulario de edición:', error);
    res.status(500).send('Error del servidor');
  }
};




// Actualizar producto
exports.actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, farmaciaId } = req.body;

    try {
        const producto = await Producto.findByPk(id);

        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }

        producto.nombre = nombre;
        producto.descripcion = descripcion;
        producto.precio = precio;
        producto.FarmaciaId = farmaciaId;

        await producto.save();

        res.redirect('/farma/productos');
    } catch (error) {
        console.error('Error al editar producto:', error);
        res.status(500).send('Error del servidor');
    }
};




// Eliminar producto
exports.eliminarProducto = async (req, res) => {
 try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).send('Producto no encontrado');
    await producto.destroy();
    res.redirect(`/farma/productos`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar producto');
  }
};





// Reabastecer producto vía AJAX
exports.reabastecerProductoAjax = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    producto.stock += parseInt(cantidad, 10);
    await producto.save();

    return res.json({ 
      success: true, 
      nuevoStock: producto.stock 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al reabastecer" });
  }
};

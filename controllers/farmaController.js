const Farmacia = require('../models/FarmaModel');
const { Op } = require('sequelize');



exports.getAllFarma = async (req, res) => {

try {
const farmacias = await Farmacia.findAll();
res.render('farmacias/farmacias',{
    nombrePagina: 'Farmacias',
    farmacias
} )


} catch (error) {
    res.status(500).json({ error: 'Error al obtener las farmacias' });    
}


};

// GET /farma/buscar?termino=algo
exports.buscarFarmacia = async (req, res) => {
  const termino = req.query.termino?.toLowerCase() || '';
  const farmacias = await Farmacia.findAll({
    where: {
      [Op.or]: [
        { nombre: { [Op.iLike]: `%${termino}%` } },
        { direccion: { [Op.iLike]: `%${termino}%` } },
      ]
    }
  });
  res.render('farmacias/farmacias',{
    nombrePagina: 'Resultados de la Busqueda',
    farmacias
} )
};





// muestra formulario para crear farmacias
exports.formFarmacia = async (req, res) => {
    res.render('farmacias/nuevaFarma', {
        nombrePagina: 'Nueva Farmacia'
    })    
}




// crear nueva farmacia
exports.createFarma = async (req, res) => {
  const { 
    nombre, 
    direccion, 
    telefono, 
    email, 
    representante } = req.body;

  try {
   const newFarma = await Farmacia.create({ 
    nombre, 
    direccion,
    telefono, 
    email, 
    representante });

  

    res.redirect('/farma/farmacias');

  } catch (err) {
    console.error(err);
    res.status(500).send('Error al guardar la farmacia');
    console.log(err);
  }

}


//muestra formulario para editar Farmacia
exports.formEditarFarma = async (req, res) => {
  const farmacia = await Farmacia.findByPk(req.params.id);
  res.render('farmacias/editFarma', {
    nombrePagina: 'Editar Farmacia',
    farmacia
  })
}

//metodo para actualizar farmacia
exports.updateFarma = async (req, res) => {
   try {
    const { 
    nombre, 
    direccion, 
    telefono 
    
     } = req.body;

const farmacia = await Farmacia.findByPk(req.params.id);


  
  farmacia.nombre = nombre;
  farmacia.direccion = direccion;
  farmacia.telefono = telefono;
  
  //farmacia.email = email;
  //farmacia.representante = representante;

  if (!farmacia) return res.status(404).send('Farmacia no encontrada');

  await farmacia.save();
  console.log('Farmacia actualizada:', farmacia);
  res.redirect('/farma/farmacias');
 
} catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el formulario de edición');
 }
}




exports.deleteFarma = async (req, res) => {
  try {
    const farmacia = await Farmacia.findByPk(req.params.id);
    if (!farmacia) return res.status(404).send('Farmacia no encontrada');
    await farmacia.destroy();
    res.redirect('/farma/farmacias');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar la farmacia');
  }
}
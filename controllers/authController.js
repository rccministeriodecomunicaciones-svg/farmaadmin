const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');



exports.login = async (req, res) => {
    res.render('auth/login', {
        nombrePagina: 'Login'
    })
}


// Función para generar el token JWT
const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '3h',
    });
};



// Controlador de login
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      // Buscar el usuario por correo electrónico
      //const user = await User.findOne({ email });
      const user = await User.findOne({ where: { email: req.body.email } });
  
      // Si el usuario no existe, devolver un error
      if (!user) {
        return res.render('auth/login', { title: 'Login', error: 'Correo inválido' });
        console.log(error);
      }
  
      // Verificar si el usuario está aprobado
      if (user.aproved === 1) {
        return res.render('auth/login', { title: 'Login', error: 'Cuenta no aprobada. Contacta al administrador.' });
        
      }
  
      // Comprobar la contraseña
      const isMatch = await bcrypt.compare(req.body.password, user.password);


      if (!isMatch) {
        return res.render('auth/login', { title: 'Login', error: 'Contraseña incorrecta' });
      }
  
      req.session.user = user;
      // Redirigir al usuario a la página de inicio
      res.redirect('/farma/admin');
    } catch (err) {
      res.render('auth/login', { title: 'Login', error: 'Ocurrió un error, por favor intenta nuevamente' });
      console.log(err);
    }
  };
  





// Controlador de logout
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
    }
    res.redirect('/farma/login');
  });
};




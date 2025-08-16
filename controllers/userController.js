const bcrypt = require('bcrypt');
const  User = require('../models/userModel');


exports.formRegister = async (req, res) =>{
    res.render('users/registrarUser', {
        nombrePagina: 'Registrar'
    })
}



exports.register = async (req, res) => {
    const {username, email, password} = req.body;


    try {
        const newUser = await User.create({
            username,
            email,
            password,
            role: 'Operador',
            aproved: '1'
        });
        
        res.redirect('/farma/login');
        
    } catch (error) {
        console.error(error);
        res.status(500).render('users/registrarUser', {error: error});
    }
};


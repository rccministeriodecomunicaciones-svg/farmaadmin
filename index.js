const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const session = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');
dotenv.config();
const RouterPrincipal = require('./Routes/routes');
const PublicRoute = require('./Routes/Publicroute');


//Conexion a la base de datos
const postgres = require('./config/dbPostgresSQL');


//Modelo
const User = require('./models/userModel');
const customer = require('./models/clientesModel');
const medicine = require('./models/medicineModel');
const orderDetails = require('./models/orderDetailsModel');
const order = require('./models/orderModel');
const supplier = require('./models/proveedoresModel');
const purchase = require('./models/purchaseModel');
const farmacias = require('./models/FarmaModel');
const Producto = require('./models/productModel');
const Carrito = require('./models/carritoModel');



// Layout
const expressLayouts = require('express-ejs-layouts')


//Sincronizacion de las tablas
User.sync({ force: false });
customer.sync({ force: false });
farmacias.sync({ force: false });
Producto.sync({ force: false });
Carrito.sync({ force: false });
orderDetails.sync({ force: false });
order.sync({ force: false });





postgres.sync()
  .then(() => {
    console.log('Base postgres Sincronizada.');
  })
  .catch(err => {
    console.log('Error sincronizando la base de datos', err.message);
  });

/////////////////////////// Middleware ///////////////////////////////////////////////

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'Layout/main');
app.use(express.static('public'));



// Configurar la sesión
app.use(session({
  secret: 'tu_secreto', // Asegúrate de establecer tu secreto en un archivo .env
  resave: false,
  saveUninitialized: true,
  //store: MongoStore.create({ mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/tu_basedatos' }),
  cookie: { maxAge: 180 * 60 * 1000 } // 3 horas
}));

// Flash messages
app.use(flash());

// Variables globales para mensajes
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Middleware para hacer que el usuario esté disponible en todas las vistas
app.use((req, res, next) => {
  if (!req.session.carrito) {
    req.session.carrito = [];
  }
  next();
});

app.use((req, res, next) => {
  //res.locals.user = req.user || null; // Asigna el usuario autenticado o null si no hay ninguno
  res.locals.user = req.session.user;
  next();
});




//Router Principal Farmacia
app.use('/farma', RouterPrincipal());
app.use('/Public', PublicRoute());

// Ruta raíz
app.get('/', (req, res) => {
  // Puedes redirigir a tu ruta pública o principal
  res.redirect('/Public/tienda');  
  // o si quieres mostrar algo directo:
  // res.render('index'); 
});

app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}`));

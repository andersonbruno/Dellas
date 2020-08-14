const express = require('express');
const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');
const ProfileController = require('./controllers/ProfileController');
const authMiddleware = require('./middlewares/auth');

const routes = express.Router();

require('./database/index');

routes.post('/users', UserController.store);
routes.post('/auth', AuthController.authenticate);
routes.post('/auth/forgot_password', AuthController.forgotPassword);
routes.post('/auth/reset_password', AuthController.resetPassword);
routes.post('/profiles/', ProfileController.store);
routes.use(authMiddleware);
routes.get('/users', UserController.index);

module.exports = routes;
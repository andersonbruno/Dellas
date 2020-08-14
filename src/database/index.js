const Sequelize = require('Sequelize');
const dbConfig = require('../config/database');

const User = require('../models/User');
const Profile = require('../models/Profile');

const connection = new Sequelize(dbConfig);

User.init(connection);
Profile.init(connection);
User.associate(connection.models);

module.exports = connection;
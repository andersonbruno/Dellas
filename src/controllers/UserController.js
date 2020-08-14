const User = require('../models/User');
const { Op } = require('sequelize');
const bcryptjs = require('bcryptjs');

module.exports = {
    async index(req, res) {
        const users = await User.findAll({
            attributes: {
                exclude: ['password','passwordResetToken','passwordResetExpires']
            }
        });
        
        return res.json(users);
    },

    async store(req, res) {
        const { login, password, name, email } = req.body;

        const userExists = await User.findOne({ 
            where: {
                [Op.or]:{
                    login,
                    email
                }
            }
        });

        if(userExists){
            return res.status(400).send({ error: 'Login already registered!'})
        }

        const hash = await bcryptjs.hash(password, 10);

        const user = await User.create({
            login, password: hash, name, email
        });

        user.password = undefined;

        return res.json(user);
    }
};
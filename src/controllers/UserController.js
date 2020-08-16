const User = require('../models/User');
const { Op } = require('sequelize');
const bcryptjs = require('bcryptjs');
const mailer = require('../modules/mailer');
const crypto = require('crypto');

module.exports = {
    async index(req, res) {
        const users = await User.findAll({
            include: { association: 'profiles' }
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

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        const hash = await bcryptjs.hash(password, 10);

        const user = await User.create({
            login, password: hash, name, email, profile_id: 2, passwordResetToken: token, passwordResetExpires: now
        });

        user.password = undefined;
        try{
            mailer.sendMail({
                to: email,
                from: 'noreply@dellas.com.br',
                subject: 'Ativação de usuário',
                template: '/auth/activate_user',
                context: { token, name: 'Anderson' }
            },(err) => {
                if(err){
                    console.log(err);
    
                    return res.status(400).send({ error : 'Cannot send forgot password email'});
                }
    
                return res.send();
            });
        } catch (err) {
            console.log(err);

            return res.status(400).send({ error: 'Erro on send mail, try again'});
        }

        return res.json(user);
    }
};
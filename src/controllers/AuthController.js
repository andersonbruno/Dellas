const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../modules/mailer');

const authConfig = require('../config/auth.json');

module.exports = {
    async authenticate(req, res) {
        const { login, password } = req.body;

        const user = await User.findOne({ 
            where: {
                login
            }
        });

        if(!user){
            return res.status(400).send({ error: 'User not found'});
        }

        if(!await bcryptjs.compare(password, user.password)){
            return res.status(400).send({ error: 'Invalid password'});
        }

        const token = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: 86400,
        });

        user.password = undefined;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        res.send({ user, token});
    },

    async forgotPassword(req, res) {
        const { email } = req.body;

        try{
            const user = await User.findOne({ where: { email: email }});

            if(!user){
                return res.status(400).send({ error: 'User not found'});
            }

            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1);

            user.passwordResetToken = token;
            user.passwordResetExpires = now;

            await user.save();

            mailer.sendMail({
                to: email,
                from: 'noreply@dellas.com.br',
                subject: 'Message',
                text: `Você esqueceu sua senha? Não tem problema, utilize esse token: ${token}`,
                //html: `<p>Você esqueceu sua senha? Não tem problema, utilize esse token: ${token}</p>`
                template: '/auth/forgot_password',
                context: { token }
            },(err) => {
                if(err){
                    console.log(err);

                    return res.status(400).send({ error : 'Cannot send forgot password email'});
                }

                return res.send();
            })
        } catch (err) {
            console.log(err);

            res.status(400).send({ error: 'Erro on forgot password, try again'});
        }
    },

    async resetPassword(req, res) {
        const { login, token, password } = req.body;

        try{
            const user = await User.findOne({ where: { login: login }});

            console.log(user);

            if(!user){
                return res.status(400).send({ error: 'User not found'});
            }

            if(token !== user.passwordResetToken){
                return res.status(400).send({ error: 'Token invalid'});
            }

            const now = new Date();

            if( now > user.passwordResetExpires){
                return res.status(400).send({ error: 'Token expired, generate a new one'});
            }

            const hash = await bcryptjs.hash(password, 10);

            user.password = hash;

            await user.save();

            res.send();
        } catch (err) { 
            res.status(400).send({ error: 'Cannot reset password, try again'});
        }
    }
};
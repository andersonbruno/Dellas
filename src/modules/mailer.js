const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars');
const exphbs = require('express-handlebars');

const { host, port, user, pass } = require('../config/mail.json');

const transport = nodemailer.createTransport({
    host,
    port,
    auth: {
        user,
        pass
    }
});

const viewPath = path.resolve(__dirname, '../resources/mail');

transport.use('compile', hbs({
    viewEngine: {
        extName: ".hbs",
        partialsDir: viewPath,
        defaultLayout: false
    },
    viewPath,
    extName: '.html',
}));

module.exports = transport;
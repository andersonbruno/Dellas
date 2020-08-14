const { Model, DataTypes } = require('Sequelize');

class Profile extends Model {
    static init (sequelize) {
        super.init({
            name: DataTypes.STRING,
        },{
            sequelize
        })
    }
}

module.exports = Profile;
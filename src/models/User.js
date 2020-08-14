const { Model, DataTypes } = require('Sequelize');

class User extends Model {
    static init (sequelize) {
        super.init({
            login: DataTypes.STRING,
            password: DataTypes.STRING,
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            passwordResetToken: DataTypes.STRING,
            passwordResetExpires: DataTypes.DATE,
        },{
            sequelize
        })
    }

    static associate(models){
        this.belongsTo(models.Profile, { foreignKey: 'profile_id', as: 'profiles' })
    }
}

module.exports = User;
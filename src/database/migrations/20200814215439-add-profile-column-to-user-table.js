'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('users', 'profile_id', {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'profiles', key: 'id'},
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        }, { transaction: t }),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('users', 'profile_id', { transaction: t }),
      ]);
    });
  }
};

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('users', 'password_Reset_Token', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),
        queryInterface.addColumn('users', 'password_Reset_Expires', {
          type: Sequelize.DataTypes.DATE,
        }, { transaction: t })
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('users', 'password_Reset_Token', { transaction: t }),
        queryInterface.removeColumn('users', 'password_Reset_Expires', { transaction: t })
      ]);
    });
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('news', 'url', {
      type: Sequelize.DataTypes.STRING,
      unique: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('news', 'url');
  }
};

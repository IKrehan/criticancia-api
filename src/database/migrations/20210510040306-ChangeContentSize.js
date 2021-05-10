'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('news', 'content', {
        type: Sequelize.TEXT,
        allowNull: false,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('news', 'content', {
        type: Sequelize.STRING,
        allowNull: false,
    })
  }
};
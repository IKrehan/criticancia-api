'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('news', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      slug: {
        type: Sequelize.STRING,
        unique: true
      },
      thumbnail: {
          type: Sequelize.STRING,
          allowNull: false
      },
      title: {
          type: Sequelize.STRING,
          allowNull: false
      },
      content: {
          type: Sequelize.STRING,
          allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id'
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('news');
  }
};

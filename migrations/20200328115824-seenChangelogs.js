module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('seenchangelogs', {
    userID: {
      type: Sequelize.STRING(30),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
  },
  { timestamps: false }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('seenchangelogs'),
};

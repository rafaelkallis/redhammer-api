exports.up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable("users", {
    id: { primaryKey: true, type: Sequelize.STRING },
    email: { type: Sequelize.STRING, allowNull: false },
    name: { type: Sequelize.STRING, allowNull: false },
    address: { type: Sequelize.STRING, allowNull: false },
    password_salt: { type: Sequelize.STRING, allowNull: false },
    password_hash: { type: Sequelize.STRING, allowNull: false },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false }
  });
};

exports.down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable("users");
};

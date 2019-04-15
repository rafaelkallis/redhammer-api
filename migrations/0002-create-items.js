exports.up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable("items", {
    id: { primaryKey: true, type: Sequelize.STRING },
    title: { type: Sequelize.STRING, allowNull: false },
    tags: { type: Sequelize.ARRAY(Sequelize.STRING), allowNull: false },
    image: { type: Sequelize.STRING, allowNull: false },
    owner_id: {
      type: Sequelize.STRING,
      references: { model: "users" }
    },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false }
  });
};

exports.down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable("items");
};

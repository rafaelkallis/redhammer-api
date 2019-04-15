/**
 * @file item model
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { BuildOptions, DataTypes, HasMany, Model, Sequelize } from "sequelize";
import { sequelize } from "../db";
import { User } from "./user";

export class Item extends Model {
  public id!: string;
  public title!: string;
  public tags!: string[];
  public image!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Item.init(
  {
    title: { type: new DataTypes.STRING(), allowNull: false },
    tags: {
      type: new DataTypes.ARRAY(new DataTypes.STRING()),
      allowNull: false
    },
    image: { type: new DataTypes.STRING(), allowNull: false }
  },
  {
    sequelize,
    tableName: "items",
    underscored: true
  }
);

Item.belongsTo(User, { as: "owner", foreignKey: "owner_id" });
User.hasMany(Item, { foreignKey: "owner_id" });

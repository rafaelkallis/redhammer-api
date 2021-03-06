/**
 * @file user model
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import { DataTypes, HasManyHasAssociationMixin, Model } from "sequelize";
import { sequelize } from "../db";
import { Item } from "./item";

export class User extends Model {
  public id!: string;
  public email!: string;
  public salt!: string;
  public hash!: string;
  public address!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public hasItem!: HasManyHasAssociationMixin<Item, string>;
}

User.init(
  {
    email: { type: new DataTypes.STRING(), allowNull: false },
    name: { type: new DataTypes.STRING(), allowNull: false },
    address: { type: new DataTypes.STRING(), allowNull: false },
    salt: { type: new DataTypes.STRING(), allowNull: false },
    hash: { type: new DataTypes.STRING(), allowNull: false }
  },
  {
    sequelize,
    tableName: "users",
    underscored: true
  }
);

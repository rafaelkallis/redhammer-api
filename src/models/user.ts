/**
 * @file user model
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import pick from "lodash.pick";
import { DataTypes, HasManyGetAssociationsMixin, Model } from "sequelize";
import { sequelize } from "../db";
import { Item } from "./item";

export interface IUser {
  id: string;
  email: string;
  passwordSalt: string;
  passwordHash: string;
  address: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class User extends Model implements IUser {
  public id!: string;
  public email!: string;
  public passwordSalt!: string;
  public passwordHash!: string;
  public address!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getItems!: HasManyGetAssociationsMixin<Item>;

  public toJSON() {
    return pick(this.get() as IUser, ["id", "email", "address"]);
  }
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
    underscored: true,
    hooks: {
      async beforeDestroy(user: User, options) {
        await Item.destroy({
          where: { ownerId: user.id },
          transaction: options.transaction
        });
      }
    }
  }
);

export function userAssociate() {
  User.hasMany(Item, { foreignKey: "ownerId" });
}

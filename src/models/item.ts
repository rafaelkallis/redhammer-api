/**
 * @file item model
 * @author Rafael Kallis <rk@rafaelkallis.com>
 */

import pick from "lodash.pick";
import { BelongsToGetAssociationMixin, DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { User } from "./user";

export interface IItem {
  id: string;
  title: string;
  tags: string[];
  image: string;
  ownerId: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class Item extends Model implements IItem {
  public id!: string;
  public title!: string;
  public tags!: string[];
  public image!: string;
  public ownerId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getOwner!: BelongsToGetAssociationMixin<User>;

  public toJSON() {
    return pick(this.get() as IItem, [
      "id",
      "title",
      "tags",
      "image",
      "ownerId"
    ]);
  }
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

export function itemAssociate() {
  Item.belongsTo(User, { as: "owner", foreignKey: "ownerId" });
}

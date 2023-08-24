import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./users"; // Import the User model

@Table({
  tableName: "posts",
})
export class Post extends Model<Post> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content!: string;

  @ForeignKey(() => User) // Define the foreign key relationship to the User model
  @Column({
    type: DataType.INTEGER,
  })
  userId!: number;

  @BelongsTo(() => User) // Define the association to the User model
  user!: User; // This will be used to associate the Post with a User instance
}

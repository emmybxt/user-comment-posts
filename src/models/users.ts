import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "Users",
})
export class User extends Model<User> {
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
  username!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  createdAt?: Date;
}

// import { Model, Table, Column, DataType } from "sequelize-typescript";

// @Table({
//   tableName: Note.NOTE_TABLE_NAME,
// })
// export class Note extends Model {
//   public static NOTE_TABLE_NAME = "note" as string;
//   public static NOTE_ID = "id" as string;
//   public static NOTE_NAME = "name" as string;
//   public static NOTE_DESCRIPTION = "description" as string;

//   @Column({
//     type: DataType.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     field: Note.NOTE_ID,
//   })
//   id!: number;

//   @Column({
//     type: DataType.STRING(100),
//     field: Note.NOTE_NAME,
//   })
//   name!: string;

//   @Column({
//     type: DataType.STRING(255),
//     field: Note.NOTE_DESCRIPTION,
//   })
//   description!: string;
// }

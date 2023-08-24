import { Sequelize } from "sequelize-typescript";

import { User } from "../models/users"; // Import the User model

export const initse = async () => {
  const connect = new Sequelize({
    database: "user-post",
    username: "emmybxt",
    password: "",
    host: "",
    port: 5432,
    dialect: "postgres",
    models: [User],
  });
  await connect
    .authenticate()
    .then(() => {
      console.log("connection successful");
    })
    .catch((err) => {
      console.log("connection failed", err);
    });
};

initse();

import sequelize from "./sequelize"; // Import the sequelize instance

async function findUserById(id: number) {
  const user = await User.findOne({ where: { id } });

  console.log(user);
  return user;
}

// Usage
const userId = 1;
findUserById(userId).then((user) => {
  console.log(user);
});

import request from "supertest";

import { createApp } from "../util/express";
import { logger } from "../util/logger";
import { initDatabase } from "../util/sequelize";
import { userRoutes } from "../util/useRoutes";

jest.mock("../helpers/users.ts");
jest.setTimeout(10000);

const name = "Test Service";

export const init = () => createApp(name, userRoutes);
(async () => {
  await initDatabase();

  init().listen(3000, () => {
    logger.info(`${name} Started successfully on : 3000`);
  });
})();

export function generateRandomLetters(count: number) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    result += letters.charAt(randomIndex);
  }

  return result;
}

const randomEmailAddress = generateRandomLetters(5) + "@testmail.com";

describe("User", () => {
  beforeEach(async () => {
    // getOneBySpy = jest.spyOn(userHelper, "generateUserBearerToken");

    const res = await request(init()).post("/v1/users").send({
      email: randomEmailAddress,
      password: "owwwoee",
      name: "444933",
    });
  });
  afterEach(jest.resetAllMocks);

  it("should fail to create a new user when email exists", async () => {
    const res = await request(init()).post("/v1/users").send({
      email: randomEmailAddress,
      password: "4444333",
      name: "luffy",
    });
    expect(res.status).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("Email already exists, try a different one");
  });

  it("should login a valid account", async () => {
    const res = await request(init()).post("/v1/login").send({
      email: randomEmailAddress,
      password: "owwwoee",
    });

    // expect(getOneBySpy).toHaveBeenCalled();

    expect(res.status).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Login successful");
  });

  it("should return all users", async () => {
    const res = await request(init()).get("/v1/users");

    expect(res.status).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});

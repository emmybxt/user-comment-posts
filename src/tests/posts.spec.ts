import request from "supertest";
import { init } from "./auth.spec";
jest.mock("../helpers/users.ts");

let user: any;
describe("Posts", () => {
  beforeEach(async () => {
    //Get A User Id
    const res = await request(init()).get("/v1/users");

    user = res.body.data[0];
  });
  afterEach(jest.resetAllMocks);

  it("should fail to create a post with an incorrect user Id", async () => {
    const res = await request(init()).post(`/v1/users/880909090/posts`).send({
      title: "TEST PIECE",
    });
    expect(res.status).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("User not found");
  });

  it("should fail to when a string is passed as a user Id to create post", async () => {
    const res = await request(init()).post("/v1/users/bcd9sd0sd/posts").send({
      title: "TEST PIECE",
    });

    expect(res.status).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  it("should reject unwanted if post title is not passed", async () => {
    const res = await request(init()).post("/v1/users/89989/posts").send({
      swiss: "TEST PIECE",
    });
    expect(res.status).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  it("should create a new post for a user", async () => {
    const res = await request(init()).post(`/v1/users/${user.id}/posts`).send({
      title: "TEST PIECE",
    });

    expect(res.status).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch("Post created successfully");
  });

  it("should return posts for a user", async () => {
    const res = await request(init()).get(`/v1/users/${user.id}/posts`);

    expect(res.status).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch("User Posts Fetched succesfully");
  });

  it("should return top users comment and posts", async () => {
    const res = await request(init()).get(`/v1/users/top-comment`);

    expect(res.status).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(
      "User top post & comments Fetched succesfully",
    );
  });
});

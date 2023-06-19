import supertest from "supertest";
import app from "../index.js";
import { describe } from "mocha";
import jwt from 'jsonwebtoken';

describe ("Test for User Router", () => {
  let toDeleteUser = {
    nickName: "delete",
    firstName: "delete",
    lastName: "delete",
    email: "delete@delete.delete",
    password: "delete",
    birthDate: "2020-01-01",
    role: "common"
  } 

  let testDeleteUser = {
    email: "delete@delete.delete",
    password: "delete",
  }
  let deleteUserToken = "";


  let testCommonUser = {
    email: "commonTest@commonTest.commonTest",
    password: "commonTest"
  }
  let commonToken = "";

  it("Should sign up a user to delete", async () => {
    await supertest(app)
      .post("/api/v1/auth/sign-up")
      .send(toDeleteUser)
      .expect(200);
  });

  it("Should sign in a common user", async () => {
    const response = await supertest(app)
      .post("/api/v1/auth/sign-in")
      .send(testCommonUser)
      .expect(200);
    commonToken = response.body.accessToken;
  });

  it("Should sign in a delete user", async () => {
    const response = await supertest(app)
      .post("/api/v1/auth/sign-in")
      .send(testDeleteUser)
      .expect(200);
    deleteUserToken = response.body.accessToken;
  });

  it("Should get all users", async () => {
    await supertest(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${commonToken}`)
      .expect(200);
  });


  it("Should fetch the information of the authenticated user.", async () => {
    await supertest(app)
      .get("/api/v1/user/me")
      .set("Authorization", `Bearer ${commonToken}`)
      .expect(200);
  });

  it("Should delete the authenticated user.", async () => {
    await supertest(app)
      .delete("/api/v1/user/me")
      .set("Authorization", `Bearer ${deleteUserToken}`)
      .expect(200);
  });

  it("Should update the information of the authenticated user.", async () => {
    await supertest(app)
      .patch("/api/v1/user/me")
      .set("Authorization", `Bearer ${commonToken}`)
      .set("Content-Type", "multipart/form-data")
      .field("nickName", 'commonTest')
      .field("firstName", 'commonTest')
      .field("lastName", 'commonTest')
      .expect(200);
  });

  it("Should update the musical genre of the authenticated user.", async () => {
    await supertest(app)
      .patch("/api/v1/user/musical-genre")
      .set("Authorization", `Bearer ${commonToken}`)
      .expect(200);
  });
});
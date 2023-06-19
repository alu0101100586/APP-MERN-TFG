import supertest from "supertest";
import app from "../index.js";
import { describe } from "mocha";
import jwt from 'jsonwebtoken';

describe ("Test for Newsletter Router", () => {
    let testArtistUser = {
      email: "artistTest@artistTest.artistTest",
      password: "artistTest",
    }
    let artistToken = "";

    it("Should sign in a user", async () => {
      const response = await supertest(app)
        .post("/api/v1/auth/sign-in")
        .send(testArtistUser)
        .expect(200);
      artistToken = response.body.accessToken;
    });

    it("Should get all emails", async () => {
      await supertest(app)
        .get("/api/v1/get-emails")
        .set("Authorization", `Bearer ${artistToken}`)
        .expect(200);
    });

    it("Should add a new subscription", async () => {
      await supertest(app)
        .post("/api/v1/new-subscription")
        .set("Authorization", `Bearer ${artistToken}`)
        .send({email: "artistTest@artistTest.artistTest"})
        .expect(200);
    });

    it("Should delete a subscription", async () => {
      await supertest(app)
        .delete("/api/v1/cancel-subscription")
        .set("Authorization", `Bearer ${artistToken}`)
        .send({email: "artistTest@artistTest.artistTest"})
        .expect(200);
    });
});
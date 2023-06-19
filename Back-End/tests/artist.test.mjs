import supertest from "supertest";
import app from "../index.js";
import { describe } from "mocha";
import jwt from 'jsonwebtoken';

describe ("Test for Artist Router", () => {
  let testArtistUser = {
    email: "artistTest@artistTest.artistTest",
    password: "artistTest",
  }
  let artistToken = "";

  let idArtist = "646c5aab6dd425fd55dfbd45";

  it("Should sign in a artist user", async () => {
    const response = await supertest(app)
      .post("/api/v1/auth/sign-in")
      .send(testArtistUser)
      .expect(200);
    artistToken = response.body.accessToken;
  });

  it("Should get all artists", async () => {
    await supertest(app)
      .get("/api/v1/artists")
      .expect(200);
  });

  it("Should get an artist by id", async () => {
    await supertest(app)
      .get(`/api/v1/artist/${idArtist}`)
      .expect(200);
  });

  it("Should get an artist by owner", async () => {
    await supertest(app)
      .get("/api/v1/owned/artist")
      .set("Authorization", `Bearer ${artistToken}`)
      .expect(200);
  });

  it("Should update an artist in ownership", async () => {
    await supertest(app)
      .patch("/api/v1/artist/me")
      .set("Authorization", `Bearer ${artistToken}`)
      .field("name", "testArtist")
      .expect(200);
  });

  it("Should delete an artist in ownership", async () => {
    await supertest(app)
      .delete("/api/v1/artist/me")
      .set("Authorization", `Bearer ${artistToken}`)
      .expect(200);
  });

  it("Should create an artist in ownership", async () => {
    await supertest(app)
      .post("/api/v1/artist")
      .set("Authorization", `Bearer ${artistToken}`)
      .field("name", "testArtist")
      .field("startDate", "2023-05-05")
      .expect(201);
  });
});
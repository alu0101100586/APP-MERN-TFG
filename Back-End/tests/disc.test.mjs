import supertest from "supertest";
import app from "../index.js";
import { describe } from "mocha";
import jwt from 'jsonwebtoken';

describe ("Test for Disc Router", () => {
  let testArtistUser = {
    email: "artistTest@artistTest.artistTest",
    password: "artistTest",
  }
  let artistToken = "";

  let testCommonUser = {
    email: "commonTest@commonTest.commonTest",
    password: "commonTest"
  }
  let commonToken = "";

  let idArtist = "646c5aab6dd425fd55dfbd45";
  let idDisc = "64623b564713922084cddf5a";
  let idCreatedDisc = "";

  it("Should sign in a common user", async () => {
    const response = await supertest(app)
      .post("/api/v1/auth/sign-in")
      .send(testCommonUser)
      .expect(200);
    commonToken = response.body.accessToken;
  });

  it("Should sign in a artist user", async () => {
    const response = await supertest(app)
      .post("/api/v1/auth/sign-in")
      .send(testArtistUser)
      .expect(200);
    artistToken = response.body.accessToken;
  });

  it("Should get all discs", async () => {
    await supertest(app)
      .get("/api/v1/discs")
      .expect(200);
  });

  it("Should get a disc by id", async () => {
    await supertest(app)
      .get(`/api/v1/disc/${idDisc}`)
      .expect(200);
  });

  it("Should get all discs by artist", async () => {
    await supertest(app)
      .get(`/api/v1/discs/artist/${idArtist}`)
      .expect(200);
  });

  it("Should get a disc by user", async () => {
    await supertest(app)
      .get("/api/v1/discs/user")
      .set("Authorization", `Bearer ${artistToken}`)
      .expect(200);
  });

  it("Should create a disc", async () => {
    const response = await supertest(app)
      .post("/api/v1/disc")
      .set("Authorization", `Bearer ${artistToken}`)
      .field("name", "test disc")
      .field("releaseDate", "2023-05-05")
      .field("price", "20")
      .field("moneyLimit", "5000")
      .field('raisedMoney', '0')
      .field("musicalGenre", "Rock")
      .field("songs", "song1")
      .field("songs", "song2")
      .field("songs", "song3")
      .expect(201);
    idCreatedDisc = response.body._id;
  });

  it("Should update a disc", async () => {
    await supertest(app)
      .patch(`/api/v1/disc/${idCreatedDisc}`)
      .set("Authorization", `Bearer ${artistToken}`)
      .field("name", "test disc updated")
      .expect(200);
  });

  it("Should add a song to a disc", async () => {
    await supertest(app)
      .post(`/api/v1/disc/song/${idCreatedDisc}`)
      .set("Authorization", `Bearer ${artistToken}`)
      .send({song: 'song4'})
      .expect(200);
  });

  it("Should delete a song from a disc", async () => {
    await supertest(app)
      .delete(`/api/v1/disc/song/${idCreatedDisc}`)
      .set("Authorization", `Bearer ${artistToken}`)
      .send({song: 'song4'})
      .expect(200);
  });

  it("Should buy a disc", async () => {
    await supertest(app)
      .patch(`/api/v1/buy/disc/${idCreatedDisc}`)
      .set("Authorization", `Bearer ${commonToken}`)
      .expect(200);
  });

  it("Should return a disc", async () => {
    await supertest(app)
      .patch(`/api/v1/return/disc/${idCreatedDisc}`)
      .set("Authorization", `Bearer ${commonToken}`)
      .expect(200);
  });

  it("Should delete a disc", async () => {
    await supertest(app)
      .delete(`/api/v1/disc/${idCreatedDisc}`)
      .set("Authorization", `Bearer ${artistToken}`)
      .expect(200);
  });
});
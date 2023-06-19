import supertest from "supertest";
import app from "../index.js";
import { describe } from "mocha";
import jwt from 'jsonwebtoken';

describe ("Test for Concert Router", () => {
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
  let idConcert = "64623b7e4713922084cddf66";
  let idCreatedConcert = "";

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

  it("Should get all concerts", async () => {
    await supertest(app)
      .get("/api/v1/concerts")
      .expect(200);
  });

  it("Should get a concert by id", async () => {
    await supertest(app)
      .get(`/api/v1/concert/${idConcert}`)
      .expect(200);
  });

  it("Should get all concerts by artist", async () => {
    await supertest(app)
      .get(`/api/v1/concerts/artist/${idArtist}`)
      .expect(200);
  });

  it("Should get a concert by user", async () => {
    await supertest(app)
      .get("/api/v1/concerts/user")
      .set("Authorization", `Bearer ${artistToken}`)
      .expect(200);
  });

  it("Should create a concert", async () => {
    const response = await supertest(app)
      .post("/api/v1/concert")
      .set("Authorization", `Bearer ${artistToken}`)
      .field("name", "Test Concert")
      .field("date", "2021-06-30")
      .field("location", "Test Location")
      .field("moneyLimit", "100")
      .field("price", "10")
      .field("raisedMoney", "0")
      .field("musicalGenre", "Rock")
      .field("participants", "Test Participant")
      .expect(201);
    idCreatedConcert = response.body._id;
  });

  it("Should update a concert", async () => {
    await supertest(app)
      .patch(`/api/v1/concert/${idCreatedConcert}`)
      .set("Authorization", `Bearer ${artistToken}`)
      .field("name", "Test Concert Updated")
      .expect(200);
  });

  it("Should add a participant to a concert", async () => {
    await supertest(app)
      .post(`/api/v1/concert/participant/${idCreatedConcert}`)
      .set("Authorization", `Bearer ${artistToken}`)
      .send({ artist: "Test New Participant" })
      .expect(200);
  });

  it("Should delete a participant from a concert", async () => {
    await supertest(app)
      .delete(`/api/v1/concert/participant/${idCreatedConcert}`)
      .set("Authorization", `Bearer ${artistToken}`)
      .send({ artistName: "Test New Participant" })
      .expect(200);
  });

  it("Should buy a ticket for a concert", async () => {
    await supertest(app)
      .patch(`/api/v1/buy/concert-ticket/${idCreatedConcert}`)
      .set("Authorization", `Bearer ${commonToken}`)
      .expect(200);
  });
  
  it("Should return a ticket for a concert", async () => {
    await supertest(app)
      .patch(`/api/v1/return/concert-ticket/${idCreatedConcert}`)
      .set("Authorization", `Bearer ${commonToken}`)
      .expect(200);
  });

  it("Should delete a concert", async () => {
    await supertest(app)
      .delete(`/api/v1/concert/${idCreatedConcert}`)
      .set("Authorization", `Bearer ${artistToken}`)
      .expect(200);
  });
});
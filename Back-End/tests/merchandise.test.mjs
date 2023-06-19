import supertest from "supertest";
import app from "../index.js";
import { describe } from "mocha";
import jwt from 'jsonwebtoken';

describe ("Test for Merchandise Router", () => {
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
  let idMerchandise = "64623ba14713922084cddf76";
  let idCreatedMerchandise = "";

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

  it("Should get all merchandises", async () => {
    await supertest(app)
      .get("/api/v1/merchandises")
      .expect(200);
  });

  it("Should get a merchandise by id", async () => {
    await supertest(app)
      .get(`/api/v1/merchandise/${idMerchandise}`)
      .expect(200);
  });

  it("Should get all merchandises by artist", async () => {
    await supertest(app)
      .get(`/api/v1/merchandises/artist/${idArtist}`)
      .expect(200);
  });

  it("Should get a merchandise by user", async () => {
    await supertest(app)
      .get("/api/v1/merchandises/user")
      .set("Authorization", `Bearer ${artistToken}`)
      .expect(200);
  });

  it("Should create a merchandise", async () => {
    const response = await supertest(app)
      .post("/api/v1/merchandise")
      .set("Authorization", `Bearer ${artistToken}`)
      .set("Content-Type", "multipart/form-data")
      .field("name", 'sudadera test')
      .field("releaseDate", '2023-05-05')
      .field("moneyLimit", '5000')
      .field("raisedMoney", '0')
      .field("size", 'S')
      .field("size", 'M')
      .field("size", 'L')
      .field("description", 'es una sudadera para hacer un test')
      .field("price", '20')
      .expect(201);
    idCreatedMerchandise = response.body._id;
  });

  it("Should update a merchandise", async () => {
    await supertest(app)
      .patch(`/api/v1/merchandise/${idCreatedMerchandise}`)
      .set("Authorization", `Bearer ${artistToken}`)
      .set("Content-Type", "multipart/form-data")
      .field("name", 'test sudadera')
      .expect(200);
  });

  it("Should add a size to a merchandise", async () => {
    await supertest(app)
      .post(`/api/v1/merchandise/size/${idCreatedMerchandise}`)
      .set("Authorization", `Bearer ${artistToken}`)
      .send({size: 'XL'})
      .expect(200);
  });

  it("Should delete a size to a merchandise", async () => {
    await supertest(app)
      .delete(`/api/v1/merchandise/size/${idCreatedMerchandise}`)
      .set("Authorization", `Bearer ${artistToken}`)
      .send({size: 'XL'})
      .expect(200);
  });

  it("Should buy a merchandise", async () => {
    await supertest(app)
      .patch(`/api/v1/buy/merchandise/${idCreatedMerchandise}`)
      .set("Authorization", `Bearer ${commonToken}`)
      .expect(200);
  });

  it("Should return a merchandise", async () => {
    await supertest(app)
      .patch(`/api/v1/return/merchandise/${idCreatedMerchandise}`)
      .set("Authorization", `Bearer ${commonToken}`)
      .expect(200);
  });

  it("Should delete a merchandise", async () => {
    await supertest(app)
      .delete(`/api/v1/merchandise/${idCreatedMerchandise}`)
      .set("Authorization", `Bearer ${artistToken}`)
      .expect(200);
  });

});

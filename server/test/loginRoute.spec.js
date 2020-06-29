const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app.js");
const db = require("../db");

chai.should();
chai.use(chaiHttp);

describe("/POST api/users/login", () => {
  before(async () => {
    await db.sync({ force: true });
  });

  it("should return a token and user object after successful auth", (done) => {
    const email = "test@login.com";
    const password = "foo1234";
    chai
      .request(app)
      .post("/api/users/register")
      .send({
        email,
        password,
      })
      .end((err, res) => {
        chai
          .request(app)
          .post("/api/users/login")
          .send({
            email,
            password,
          })
          .end((err, res) => {
            res.body.should.have.property("token");
            res.body.should.have.property("user");
            done();
          });
      });
  });
});

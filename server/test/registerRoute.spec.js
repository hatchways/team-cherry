const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app.js");
const db = require("../db");

chai.should();
chai.use(chaiHttp);

describe("/POST api/users/register", () => {
  beforeEach(async () => {
    await db.sync({ force: true });
  });

  it("should not allow password length of less than 7 to be valid", (done) => {
    chai
      .request(app)
      .post("/api/users/register")
      .send({ email: "some_email@example.com", password: "foo123" })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have
          .property("password")
          .eql("Password must be at least 7 characters");
        done();
      });
  });
});

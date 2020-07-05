const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const db = require("../db");

const User = db.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      // this prevents password from being serialized on the response output
      // because the password field is now a getter function
      // Therefore to access the value stored you must call it as:
      // someUserModel.password()
      return () => this.getDataValue("password");
    },
  },
});

// custom instance methods
User.prototype.checkPassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password());
};

// model hooks
const hashPassword = async (user) => {
  if (user.changed("password")) {
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(user.password(), salt);
    user.password = hashedPw;
  }
};

// register encrypting method as a hook to run before user creation
User.beforeCreate(hashPassword);

module.exports = User;

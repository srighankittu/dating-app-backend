const validator = require("validator");
const signUpValidations = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Invalid Name dude! WTF? Type your real name dick");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid Email dude!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Weak ass password");
  }
};

module.exports = {
  signUpValidations,
};

const bycrpt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const UserModel = require("../../models/user");

module.exports = {
  createUser: async (args) => {
    try {
      const existingUser = await UserModel.findOne({
        email: args.userInput.email,
      });
      if (existingUser) {
        throw new Error("User exists already.");
      }
      const hashedPassword = await bycrpt.hash(args.userInput.password, 12);
      const user = new UserModel({
        email: args.userInput.email,
        password: hashedPassword,
      });
      const result = await user.save();
      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({email ,password}) => {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw new Error('User Does not exist!');
    }
    const isEqual = await bycrpt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, 'X33dcS224SSASF2SDA', {
      expiresIn: '2h'
    });

    return { userId: user.id , token: token , tokenExpiration: 1 }
  }
};

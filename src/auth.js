require("dotenv").config();
const { sign } = require("jsonwebtoken");

const createAccessToken = (User) => {
  return sign({ userId: User.id }, "hjkskdnkjnjknjknjknkjnjk", {
    expiresIn: "15m",
  });
};
const createRefeshToken = (User) => {
  return sign(
    { userId: User.id, tokenVersion: User.tokenVersion },
    "fjkajkjklnklnkljkl",
    {
      expiresIn: "7d",
    }
  );
};
module.exports = { createAccessToken, createRefeshToken };

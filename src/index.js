const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server-express");
const cookieParser = require("cookie-parser");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { applyMiddleware } = require("graphql-middleware");
const { verify } = require("jsonwebtoken");
const { Users } = require("./schema");

const { createAccessToken, createRefeshToken } = require("./auth");
const { sendRefreshToken } = require("./sendRefreshToken");
const { isAuth } = require("./isAuth");
const { typeDefs } = require("./typeDefs");
const { resolvers } = require("./resolvers");
const cors = require("cors");
const { setCurrUser } = require("./currUser");
(async () => {
  const app = express();

  //cors
  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

  app.use(cookieParser());
  //refreshtoken
  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: "1" });
    }
    let payload = null;
    try {
      payload = verify(token, "fjkajkjklnklnkljkl");
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: "2" });
    }
    //token is valid
    //we can send back the accessToken
    const User = await Users.findById(payload.userId);
    setCurrUser(payload.userId);

    if (!User) {
      return res.send({ ok: false, accessToken: "3" });
    }
    if (User.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "4" });
    }
    sendRefreshToken(res, createRefeshToken(User));

    return res.send({ ok: true, accessToken: createAccessToken(User) });
  });

  //middleware
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const middleware = [isAuth];
  const schemaWithMiddleware = applyMiddleware(schema, ...middleware);
  const apolloServer = new ApolloServer({
    schema: schemaWithMiddleware,
    context: ({ req, res }) => ({ req, res }),
  });

  //express as middleware
  apolloServer.applyMiddleware({ app, cors: false });

  await mongoose
    .connect("mongodb://localhost/academy")
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => console.error("Could not connect to mongodb", err));

  app.listen(4000, () => {
    console.log("express server started on 4000");
  });
})();

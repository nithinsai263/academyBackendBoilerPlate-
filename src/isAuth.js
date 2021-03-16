const { verify } = require("jsonwebtoken");

const isAuth = {
  Query: {
    me: async (resolve, parent, args, context, info) => {
      const authorization = context.req.headers["authorization"];
      if (!authorization) {
        throw new Error("bluenot authenticated");
      }
      try {
        const token = authorization.split(" ")[1];
        const payload = verify(token, "hjkskdnkjnjknjknjknkjnjk");
      } catch (err) {
        console.log(err);
        throw new Error("blahnot authenticated");
      }
      return await resolve(parent, args, context, info);
    },
  },
};

module.exports = { isAuth };

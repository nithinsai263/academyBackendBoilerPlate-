const { Courses, Paths, Users } = require("./schema");
const { hash, compare } = require("bcryptjs");
const { createAccessToken, createRefeshToken } = require("./auth");
const { sendRefreshToken } = require("./sendRefreshToken");
const { getcurrUser, setCurrUser } = require("./currUser");

const resolvers = {
  Query: {
    findall: () => Courses.find(),
    findcourse: (_, { course_id }) => {
      return Courses.findOne({ course_id: course_id }, function (err, obj) {});
    },
    findallpaths: () => Paths.find(),

    findpath: (_, { course_id }) => {
      return Paths.findOne(
        { "courses.course_id": course_id },
        function (err, obj) {}
      );
    },
    finduser: () => Users.find(),

    userdata: (_, { id }) => {
      return Users.findById(id);
    },
    me: (_, {}, req) => {
      return getcurrUser();
    },
  },
  Mutation: {
    createUser: async (_, { email, password, name, username }) => {
      const hashedPassword = await hash(password, 12);
      const User = new Users({
        email,
        password: hashedPassword,
        first_name: name,
        user_name: username,
      });
      try {
        await User.save();
      } catch (err) {
        console.log(err);
        return false;
      }
      return true;
    },
    login: async (_, { email, password }, { res }) => {
      const User = await Users.findOne({ email: email });
      if (!User) {
        throw new Error("could not find the user");
      }
      const valid = await compare(password, User.password);
      if (!valid) {
        throw new Error("bad password");
      }

      //login succesfull
      sendRefreshToken(res, createRefeshToken(User));
      setCurrUser(User.id);
      return { accessToken: createAccessToken(User), userId: User.id };
    },

    addinprogresscourseuser: async (
      _,
      { id, course_id, course_name1, course_name2, module }
    ) => {
      // var currentcourses = {
      //   course_id: "madman",
      //   course_name1: "mapmap",
      //   course_name2: "phullmap",
      //   module: [
      //     {
      //       module_id: "uwioueiojiom",
      //       module_name: "Module1",
      //       flag: 1,
      //     },
      //     {
      //       module_id: "uwioueiojiom",
      //       module_name: "Module1",
      //       flag: 0,
      //     },
      //   ],
      // };

      var currentcourses = {
        course_id: course_id,
        course_name1: course_name1,
        course_name2: course_name2,
        module: module,
      };

      await Users.findByIdAndUpdate(id, {
        $push: { "courses.inprogress_courses": currentcourses },
      });
      return true;
    },

    addcompletedcourseuser: async (_, { id }) => {
      var completedcourses = {
        course_id: "madman",
        course_name1: "mapmap",
        course_name2: "phullmap",
        module: [
          {
            module_id: "uwioueiojiom",
            module_name: "Module1",
            flag: 1,
          },
          {
            module_id: "uwioueiojiom",
            module_name: "Module1",
            flag: 0,
          },
        ],
      };
      await Users.findByIdAndUpdate(id, {
        $pull: {
          "courses.inprogress_courses": {
            course_id: completedcourses.course_id,
          },
        },
      });
      await Users.findByIdAndUpdate(id, {
        $push: { "courses.completed_courses": completedcourses },
      });
      return true;
    },

    addinprogresspathuser: async (
      _,
      { id, path_id, path_title1, path_title2, courses }
    ) => {
      var currentpath = {
        path_id: path_id,
        path_title1: path_title1,
        path_title2: path_title2,
        courses: courses,
      };
      console.log(courses);
      try {
        await Users.findByIdAndUpdate(id, {
          $push: { "paths.inprogress_paths": currentpath },
        });
      } catch (err) {
        console.log(err);
        return false;
      }
      return true;
    },

    addcompletedpathuser: async (_, { id }) => {
      var completedpath = {
        path_id: "yoyo420",
        path_title1: "Lorem & Dollar",
        path_title2: "Lorem & Dollar",
        courses: [
          {
            course_id: "fasjkknsijfiew",
            course_name1: "Nmap",
            flag: 2,
          },
          {
            course_id: "fasjkknsijfiew",
            course_name1: "Nmap",
            flag: 1,
          },
          {
            course_id: "fasjkknsijfiew",
            course_name1: "Nmap",
            flag: 0,
          },
        ],
      };
      await Users.findByIdAndUpdate(id, {
        $pull: {
          "paths.inprogress_paths": {
            path_id: completedpath.path_id,
          },
        },
      });
      await Users.findByIdAndUpdate(id, {
        $push: { "paths.completed_paths": completedpath },
      });
      return true;
    },

    changeuserprofileinfo: async (_, { id }) => {
      var first_name = "kumar";
      var last_name = "ankit";
      var profession = "student";

      await Users.findByIdAndUpdate(id, {
        $set: {
          first_name: first_name,
          last_name: last_name,
          profession: profession,
        },
      });
      return true;
    },

    changeuseraccountinfo: async (_, { id }) => {
      var user_name = "woooo";
      var password = "abcdef";

      await Users.findByIdAndUpdate(id, {
        $set: {
          password: password,
          user_name: user_name,
        },
      });
      return true;
    },
  },
};
module.exports = { resolvers };

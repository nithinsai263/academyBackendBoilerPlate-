const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    findall: [structure]
    findcourse(course_id: String): structure
    findallpaths: [pathstructure]
    findpath(course_id: String): pathstructure
    finduser: [userstructure]
    userdata(id: ID): userstructure
    me: ID
  }
  scalar JSON
  type Mutation {
    createUser(
      email: String!
      password: String!
      name: String!
      username: String!
    ): Boolean!

    login(email: String!, password: String!): LoginResponse

    addinprogresscourseuser(
      id: ID
      course_id: String
      course_name1: String
      course_name2: String
      module: [usercoursemoduleinput]
    ): Boolean
    addcompletedcourseuser(id: ID): Boolean
    addinprogresspathuser(
      id: ID
      path_id: String
      path_title1: String
      path_title2: String
      courses: [userpathcourseinput]
    ): Boolean
    addcompletedpathuser(id: ID): Boolean
    changeuserprofileinfo(id: ID): Boolean
    changeuseraccountinfo(id: ID): Boolean
  }
  type LoginResponse {
    accessToken: String!
    userId: ID!
  }

  type userstructure {
    user_id: String
    user_name: String
    first_name: String
    last_name: String
    profession: String
    email: String
    flashes: String
    courses: usercourses
    paths: userpaths
  }

  type userpaths {
    inprogress_paths: [userinprogresspaths]
    completed_paths: [usercompletedpaths]
  }

  type usercompletedpaths {
    path_id: String
    path_title1: String
    path_title2: String
    courses: [userpathcourses]
    certificate: String
  }

  type userinprogresspaths {
    path_id: String
    path_title1: String
    path_title2: String
    courses: [userpathcourses]
  }

  type userpathcourses {
    course_id: String
    course_name1: String
    flag: Int
  }

  type usercourses {
    inprogress_courses: [userinprogresscourses]
    completed_courses: [usercompletedcourses]
  }

  type usercompletedcourses {
    course_id: String
    course_name1: String
    course_name2: String
    module: [usercoursemodule]
    review: usercoursereview
  }

  type usercoursereview {
    stars: Int
    feedback: String
  }

  type userinprogresscourses {
    course_id: String
    course_name1: String
    course_name2: String
    module: [usercoursemodule]
  }

  type usercoursemodule {
    module_id: String
    module_name: String
    flag: Int
  }

  input userpathcourseinput {
    course_id: String
    course_name1: String
  }

  input usercoursemoduleinput {
    module_id: String
    module_name: String
    flag: Int
  }

  type pathstructure {
    path_id: String
    path_title1: String
    path_title2: String
    difficulty: String
    description: String
    flashes: String
    courses: [pathcourses]
  }

  type pathcourses {
    course_id: String
    course_name1: String
  }

  type structure {
    course_id: String
    course_name1: String
    course_name2: String
    photo: String
    subtitle: String
    description: String
    difficulty: String
    flashes: String
    overview: strucoverview

    modules: [strumod]
  }

  type strumod {
    module_id: String
    module_name: String
    module_video: String
    module_content: [strumodcont]
    module_questions: [strumodques]
  }

  type strumodcont {
    title: String
    description: [String]
    image: String
  }

  type strumodques {
    question: String
    answer: String
  }

  type strucoverview {
    sections: [String]
    coursedetailscontent: [strudetails]
  }

  type strudetails {
    title1: String
    title2: String
    content: [String]
  }
`;
module.exports = { typeDefs };

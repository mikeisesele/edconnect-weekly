const users = require("../mocks/user");
const projects = require("../mocks/props");
const { getPrograms, getGradYears } = require("../../server/services/school");
const programs = getPrograms();
const graduationYears = getGradYears();


const message = {

  response: {
            data: {
              programs, 
              graduationYears 
            },
            currentUser : users[3],
            result: true,
            message: "Profile retrieval successful",  
  }
}

module.exports = message  
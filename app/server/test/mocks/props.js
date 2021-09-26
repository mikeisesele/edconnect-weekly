const users = require("../mocks/user");

const message = {
    response : {
          data: {
            projects: {}
          },
          currentUser : users[3]
        }
} 
module.exports = message  
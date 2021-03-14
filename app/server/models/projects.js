const DataModel = require('./data_model');

class Project {
    constructor(id, name, abstract, authors, tags, createdBy) {
        this.id = id;
        this.name = name;
        this.abstract = abstract;
        this.authors = authors;
        this.tags = tags;
        this.createdBy = createdBy;
    }
}

// validate(obj) - This method will do the following validations :
// The authors and tags properties are arrays
// Validate that the none of the provided properties are empty
// The method should return true if all of the tests pass and false otherwise
class Projects extends DataModel {
    validate(obj) {
        let counter = 0;
        let tcounter = 0

        for(let key in obj){
            if (obj[key] == "" || obj[key] == null || obj[key] == "undefined"){
                counter++
            }

            if ((Array.isArray(obj.authors)) && (Array.isArray(obj.tags))){
                tcounter++            
            }   else {
                    counter++;
                }
        }

            if(counter > 0){
                return false;
            }   else {
                return true
            }
        }


}
// Do not worry about the below for now; It is included so that we can test your code
// We will cover module exports in later parts of this course
module.exports = {
    Project,
    Projects
};
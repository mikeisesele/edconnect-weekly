const DataModel = require('./data_model');

class User {
    constructor(id, firstname, lastname, email, password, matricNumber, program, graduationYear) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.matricNumber = matricNumber;
        this.program = program;
        this.graduationYear = graduationYear;
    }
    // getFullName() - returns a combination of the user’s first name and last name. e.g getFullName() will return “Bola Solade” if firstname is Bola and lastname is Solade
    getFullName() {
        return `${this.firstname} ${this.lastname}`
    }
}

class Users extends DataModel {
    //     authenticate(email, password) - Checks if provided email and password combination is correct
    // This should return true if the email and password combination is valid and false otherwise
    authenticate(email, password) {
        let found = ""
        this.data.forEach((user) => {
            if (user.email === email && user.password === password) {
                found = "true";
            }    
        })

        if (found == "true"){
            return true
        }   else {
            return false
        }
    }
    
    // getByEmail(email) - Returns user with specified email address
    // This should return the User object with the specified email address if such a user is found
    // This should return null if no user with the specified email address is found
    
    getByEmail(email) {
        let found = ""
        this.data.forEach((user) => {
            if (user.email === email) {
                found = user;
            }    
        })

        if(found == ""){
            return null
        }   else {
            return found
        }
    }

    // getByMatricNumber(matricNumber) - Returns user with specified matric number
    // This should return the User object with the specified matric number if such a user is found
    // This should return null if no user with the specified matric number is found
    getByMatricNumber(matricNumber) {
        let found = ""
        this.data.forEach((user) => {
            if (user.matricNumber === matricNumber) {
                found = user;
            }   
        })

        if(found == ""){
            return null
        }   else {
            return found
        }
    }

    //     validate(obj)  - This method will do the following validations :
    // Validate that the none of the provided properties are empty
    // Validate that no user in the data array already has the specified email address
    // Validate that no user in the data array already has the specified matric number
    // Validate that the password is at least 7 characters in length
    // The method should return true if all of the tests pass and false otherwise
    validate(obj){
        let empatArrayErrorCounter = 0
        let nonEmptyArrayErrorCounter = 0
        // check if obj is first added user
        if (this.data.length == 0){
            // check the properties of the first added and ensure password is long
            Object.keys(obj).forEach(key => {
                if (obj[key] == "" || obj[key] == "undefined"){
                    empatArrayErrorCounter++;
                }
            })       

            if (obj.password.length < 7){
                empatArrayErrorCounter++;
            }

            if(empatArrayErrorCounter > 0){
                return false
            } else {
                return true
            }       
        }

        // if a user already exist
        if (this.data.length > 0){
            // check the properties of the currently added and ensure password is long
                Object.keys(obj).forEach(key => {
                    if (obj[key] == "" || obj[key] == "undefined"){
                        nonEmptyArrayErrorCounter++;
                    }   else {
                        // loop through already added users and check for duplicate emails and matric numbers using unique id.                        
                        this.data.forEach(person => {            
                            if(((person.email == obj.email) && (person.id != obj.id)) || 
                            ((person.matricNumber == obj.matricNumber) && (person.id != obj.id))){
                                nonEmptyArrayErrorCounter++
                            } 
                        })  
                    }     
                })

                if (obj.password.length < 7){
                    nonEmptyArrayErrorCounter++;
                }

                if(nonEmptyArrayErrorCounter > 0){
                    return false
                } else {
                    return true
                }
    
            }    

           
        }
}

// Do not worry about the below for now; It is included so that we can test your code
// We will cover module exports in later parts of this course
module.exports = {
    User,
    Users
}
class DataModel {
    constructor() {
        this.data = [];
    }

    getAll() {
        return this.data;
    }

    // getById(id)
    // This should return the object with the specified id if such an object exists
    // This should return null if no object with the specified id was found

    getById(id) {
        let found = ""
        this.data.forEach((obj) => {
            if(obj.id === id){
                found = obj;
            }    
        })
        
        if(found != ""){
            return found;
        } else {
            return null;
        }
    }

    save(obj) {
        if (this.validate(obj)) {
            this.data.push(obj);
            return true;
        } else{
            return false;
        }
    }

    //     update(obj, id)
    // The update method updates the properties of an object in the data array with the specified id
    // This should return true if an object with the specified id was found
    // This should return false if no object with the specified id was found in the data array
    update(obj, id) {  
        let found

        found = this.data.find( item => item.id = id)
    
        for(let key in obj){
            if(obj[id] == found[id]){
                found[key] = obj[key]
            } 
        }   
        
        if(found.id == id){
            return true
        } else {
            return false;
        }
    }

    // delete(id)
    // The delete method deletes the object with the specified id
    // This should return true if an object with the specified id was found in the array and deleted
    // This should return false if no object with the specified id was found
    delete(id) {
        let user = this.data.find(item => item.id === id);
        let index = this.data.indexOf(user);
        if (user) {
            this.data.splice(index, 1);
            return true;
        }
        return false;
}

    // this method will be overriden in the sub classes
    validate(obj) 
    {
        return false;
    }
};
// Do not worry about the below for now; It is included so that we can test your code
// We will cover module exports in later parts of this course
module.exports = DataModel;

var helper = {};


helper.generateRandomString = (stringLength) => { 
    stringLength = typeof(stringLength) === 'number' ? stringLength : 20;
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
    var str = '';
    for(i = 0; i < stringLength; i++){
        var randomChar = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        str+= randomChar;
    }
    return str;
};


helper.formatObject = (oldObject = {}, newObject ={}) => {
    let tempObj  = {};
    Object.keys(newObject).map(key => {
        console.log(key);
        if(oldObject.hasOwnProperty(key)){
            tempObj[key] = newObject[key];
        }
    });
    
    // console.log(oldObject);
    console.log(tempObj);
    return {...oldObject, ...tempObj};
};

// borrow books
helper.validateID = (id,record)=>{
    const fs = require("fs");
    const path = id;
    const maBook = record;
    fs.access(path, function (error) {
    if (error) {
        console.log("DOES NOT exist:", path);
        console.error(error);
    } else {
        console.log("exists:", path);
        // if book, 
        if(path.length === 49){
        fs.readFile(path, "utf8", (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return;
            }
            // console.log("File data:", jsonString);
            let tempEdit = JSON.parse(jsonString);
            if (tempEdit.availabeCopies > 0){
                console.log(`we have ${tempEdit.availabeCopies} copies available`);
                tempEdit.availabeCopies = tempEdit.availabeCopies - 1;
                
                fs.writeFile(path, JSON.stringify(tempEdit), err => {
                    if (err) console.log("Error writing file:", err);
                    console.log(`book rented successfully, ${tempEdit.availabeCopies} copies remaining`);
                });

            } else{
                console.log(" this book is not currently available for rent");
            }
        });

        } else if(path.length === 59){
            console.log(path + " is a user");
            fs.readFile(path, "utf8", (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return;
            }
            // console.log("File data:", jsonString);
            let tempEdit = JSON.parse(jsonString);
            console.log(tempEdit);
            tempEdit.borrowedBooks.push(maBook);
            fs.writeFile(path, JSON.stringify(tempEdit), err => {
                if (err) console.log("Error writing file:", err);
                console.log(`book successfully registered inside the user`);
            });
        });
        }
    }
    });
}



// return book
helper.returnbook = (id,record)=>{
    const fs = require("fs");
    const path = id;
    const maBook = record;
    fs.access(path, function (error) {
    if (error) {
        console.log("DOES NOT exist:", path);
        console.error(error);
    } else {
        console.log("exists:", path);
        // if book, 
        if(path.length === 49){
        fs.readFile(path, "utf8", (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return;
            }
            // console.log("File data:", jsonString);
            let tempEdit = JSON.parse(jsonString);
            if (tempEdit.availabeCopies > 0){
                console.log(`we have ${tempEdit.availabeCopies} copies available`);
                tempEdit.availabeCopies = tempEdit.availabeCopies + 1;
                
                fs.writeFile(path, JSON.stringify(tempEdit), err => {
                    if (err) console.log("Error writing file:", err);
                    console.log(`book returned successfully, ${tempEdit.availabeCopies} copies now available`);
                });
            } else{
                console.log("this book is now in the possession of a user");
            }
        });

        } else if(path.length === 59){
            console.log(path + " is a user");
            fs.readFile(path, "utf8", (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return;
            }
            // console.log("File data:", jsonString);
            let tempEdit = JSON.parse(jsonString);
            console.log(tempEdit);
            let trick = tempEdit.borrowedBooks.indexOf(maBook);
            tempEdit.borrowedBooks.splice(trick, 1);
            fs.writeFile(path, JSON.stringify(tempEdit), err => {
                if (err) console.log("Error writing file:", err);
                console.log(`book successfully returned to the library`);
            });
        });
        }
    }
    });
}
module.exports = helper;
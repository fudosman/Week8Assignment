const fs = require('fs');
const path = require('path');
const helper = require('./helper')
var lib = {
  baseDir: path.join(__dirname, '/../.data/')
};

//creating
lib.create = (dir, filename, data, callback) => {
  //open file for writing
  const filePath = lib.baseDir + dir + "\\" + filename + '.json';
  fs.open(filePath, 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      //convert the data to string
      const stringData = JSON.stringify(data);
      //write th file and close it
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback("Error closing the new file");
            }
          });
        } else {
          callback("Error writing to new file");
        }
      });

    } else {
      callback("could not creat new file, it may already exist");
    }
  });
};

//reading

lib.read = (dir, filename, callback) => {
  const filePath = lib.baseDir + dir + "\\" + filename + '.json';
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (!err && data) {
      callback(false, JSON.parse(data));
    }
    else {
      callback(err, data);
    }
  });
};

//updating
lib.update = (dir, filename, data, callback) => {
  const filePath = lib.baseDir + dir + "\\" + filename + '.json';
  //open the file
  fs.open(filePath, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      fs.readFile(fileDescriptor, 'utf-8', (err, bookToUpdate) => {
        if (!err && bookToUpdate) {
          let updatedBook = helper.formatObject(JSON.parse(bookToUpdate), data);
          var updatedData = JSON.stringify(updatedBook);
          //truncate the fule for update;
          fs.truncate(fileDescriptor, (err) => {
            if (!err) {
              fs.writeFile(filePath, updatedData, (err) => {
                if (!err) {
                  fs.close(fileDescriptor, (err) => {
                    if (!err) {
                      callback(false);
                    } else {
                      callback("error closing the file");
                    }
                  });
                } else {
                  callback('error writing to existing file');
                }
              });
            }
          });
        } else {
          callback(err);
        }
      });



    } else {
      callback('could not open file for updating, maybe it does not exist');
    }
  });
};


//Delete File
lib.delete = (dir, filename, callback) => {
  const filePath = lib.baseDir + dir + "\\" + filename + '.json';
  fs.unlink(filePath, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback(err);
    }
  });
};

// borrow book
lib.validateID = (id,record)=>{
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
lib.returnbook = (id,record)=>{
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

module.exports = lib;
const fileUtil = require('./fileUtil');
const routeHandler = {};
const helper = require('./helper');

routeHandler.Books = (data, callback) => {
  const acceptableHeaders = ["post", "get", "put", "delete"];
  if (acceptableHeaders.indexOf(data.method) > -1) {
    routeHandler._books[data.method](data, callback);
  } else {
    callback(405);
  }
};

// route for users
routeHandler.Users = (data, callback) => {
  const acceptableHeaders = ["post", "get", "put", "delete"];
  if (acceptableHeaders.indexOf(data.method) > -1) {
    routeHandler._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// route for lend book
routeHandler.Lend = (data, callback)=>{
  const acceptableHeaders = ["put"];
  if (acceptableHeaders.indexOf(data.method)> -1){
    // save the data.query.id as userID
    let userID = data.query.id;
    // save the data.payload.id as bookID
    let bookID = data.payload.id;
    // read the books folder with the bookID, ensure the available book is greater than 0
    fileUtil.validateID(`./.data/books/${bookID}.json`);
    // read the users folder with the userID, ensure that the user exists
    fileUtil.validateID(`./.data/users/${userID}.json`,bookID);
    callback(200, { message: 'user has successfully borrowed a book', data: data});
  }else {
    callback(405);
  }
};


// route for returnbook
routeHandler.ReturnBook = (data, callback)=>{
  const acceptableHeaders = ["put"];
  if (acceptableHeaders.indexOf(data.method)> -1){
    // save the data.query.id as userID
    let userID = data.query.id;
    // save the data.payload.id as bookID
    let bookID = data.payload.id;
    // read and update the books folder with the bookID, 
    fileUtil.returnbook(`./.data/books/${bookID}.json`);
    // read and update the users folder with the userID
    fileUtil.returnbook(`./.data/users/${userID}.json`,bookID);
    callback(200, { message: 'user has successfully returned a book to the library', data:data});
  }else {
    callback(405);
  }
};

//main book route object
routeHandler._books = {};
//main user route object
routeHandler._users = {};


routeHandler._users.post = (data, callback) => {
  //validate that all required fields are filled out
  let name = typeof (data.payload.name) === 'string' && data.payload.name.trim().length > 0 ? data.payload.name : false;
  let age = typeof (data.payload.age) === 'string' && !isNaN(parseInt(data.payload.age)) ? data.payload.age : false;
  let email = typeof (data.payload.email) === 'string' && data.payload.email.trim().length > 0 ? data.payload.email : false;
  let address = typeof (data.payload.address) === 'string' && data.payload.address.trim().length > 0 ? data.payload.address : false;
  let borrowedBooks = typeof (data.payload.borrowedBooks) === 'string' ? data.payload.borrowedBooks : false;
  
  if (name && age && email && address && borrowedBooks) {
    const fileName = helper.generateRandomString(40);
    data.payload.borrowedBooks = [];
    fileUtil.create('users', fileName, data.payload, (err) => {
      if (!err) {
        callback(200, { message: "user created successfully"});
      } else {
        callback(400, { message: "could not add user" });
      }
    });
  }else{
    callback(400, { message: "Some fiedls are incorrect" });
  }
};

//Post route -- for creating a book
routeHandler._books.post = (data, callback) => {
  //validate that all required fields are filled out
  let name = typeof (data.payload.name) === 'string' && data.payload.name.trim().length > 0 ? data.payload.name : false;
  let price = typeof (data.payload.price) === 'string' && !isNaN(parseInt(data.payload.price)) ? data.payload.price : false;
  let availabeCopies = typeof (data.payload.availabeCopies) === 'string' && !isNaN(parseInt(data.payload.availabeCopies)) ? data.payload.availabeCopies : false;
  let author = typeof (data.payload.author) === 'string' && data.payload.author.trim().length > 0 ? data.payload.author : false;
  let publisher = typeof (data.payload.publisher) === 'string' && data.payload.publisher.trim().length > 0 ? data.payload.publisher : false;
  
  if (name && price && author && publisher && availabeCopies) {
    const fileName = helper.generateRandomString(30);
    data.payload.availabeCopies = data.payload.availabeCopies || "1";
    fileUtil.create('books', fileName, data.payload, (err) => {
      if (!err) {
        callback(200, { message: "book added successfully", data: null });
      } else {
        callback(400, { message: "could add book" });
      }
    });
  }else{
    callback(400, { message: "Some fiedls are incorrect" });
  }
};


//Get route -- for geting a user
routeHandler._users.get = (data, callback) => {
  if (data.query.id) {
    fileUtil.read('users', data.query.id, (err, data) => {
      if (!err && data) {
        callback(200, { message: 'this is a valid User ID', data: data });
      } else {
        callback(404, { err: err, data: data, message: 'could not retrieve user' });
      }
    });
  } else {
    const fs = require("fs");
    let directory_name = "./.data/users/";
    let filenames = fs.readdirSync(directory_name);
    console.log("\nFilenames in directory:");
    let allusers = [];
    filenames.forEach((file) => {
        console.log("File:", file);
        allusers.push(file);
    });
    callback(200, {data: allusers, message: 'these are all the registered users of the library' });
  }
};

//Get route -- for geting a book
routeHandler._books.get = (data, callback) => {
  if (data.query.name) {
    fileUtil.read('books', data.query.name, (err, data) => {
      if (!err && data) {
        callback(200, { message: 'book retrieved', data: data });
      } else {
        callback(404, { err: err, data: data, message: 'could not retrieve book' });
      }
    });
  } else {
    const fs = require("fs");
    let directory_name = "./.data/books/";
    let filenames = fs.readdirSync(directory_name);
    console.log("\nFilenames in directory:");
    let allbooks = [];
    filenames.forEach((file) => {
        console.log("File:", file);
        allbooks.push(file);
    });
    callback(200, {data: allbooks, message: 'these are the book IDs in the library now' });
  }
};

//Put route -- for updating a book
routeHandler._users.put = (data, callback) => {
  if (data.query.id) {
    fileUtil.update('users', data.query.id, data.payload, (err) => {
      if (!err) {
        callback(200, { message: 'user updated successfully' })
      } else {
        callback(400, { err: err, data: null, message: 'could not update user' });
      }
    });
  } else {
    callback(404, { message: 'user not found' });
  }
};



//Put route -- for updating a book
routeHandler._books.put = (data, callback) => {
  if (data.query.name) {
    fileUtil.update('books', data.query.name, data.payload, (err) => {
      if (!err) {
        callback(200, { message: 'book updated successfully' });
      } else {
        callback(400, { err: err, data: null, message: 'could not update book' });
      }
    });
  } else {
    callback(404, { message: 'book not found' });
  }
};


//Delete route -- for deleting a user
routeHandler._users.delete = (data, callback) => {
  if (data.query.id) {
    fileUtil.delete('users', data.query.id, (err) => {
      if (!err) {
        callback(200, { message: 'user deleted successfully' });
      } else {
        callback(400, { err: err, message: 'could not delete user' });
      }
    })
  } else {
    callback(404, { message: 'user not found' });
  }
};


//Delete route -- for deleting a book
routeHandler._books.delete = (data, callback) => {
  if (data.query.name) {
    fileUtil.delete('books', data.query.name, (err) => {
      if (!err) {
        callback(200, { message: 'book deleted successfully' });
      } else {
        callback(400, { err: err, message: 'could not delete book' });
      }
    })
  } else {
    callback(404, { message: 'book not found' });
  }
};


routeHandler.ping = (data, callback) => {
  callback(200, { response: "server is live" });
};

routeHandler.notfound = (data, callback) => {
  callback(404, { response: 'not found' });
};


module.exports = routeHandler;
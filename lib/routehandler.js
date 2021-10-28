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
    data.payload.borrowedBooks = {};
    fileUtil.create('users', fileName, data.payload, (err) => {
      if (!err) {
        callback(200, { message: "user created successfully", data: null });
      } else {
        callback(400, { message: "could not add user" });
      }
    });
  }else{
    callback(400, { message: "Some fiedls are incorrect" });
  }
};

//Get route -- for geting a book
routeHandler._users.get = (data, callback) => {
  if (data.query.id) {
    fileUtil.read('users', data.query.id, (err, data) => {
      if (!err && data) {
        callback(200, { message: 'this is a valid id', data: data });
      } else {
        callback(404, { err: err, data: data, message: 'could not retrieve user' });
      }
    });
  } else {
    callback(404, { message: 'user not found', data: null });
  }
};

//Put route -- for updating a book
routeHandler._users.put = (data, callback) => {
  if (data.query.name) {
    fileUtil.update('users', data.query.name, data.payload, (err) => {
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

//Delete route -- for deleting a book
routeHandler._users.delete = (data, callback) => {
  if (data.query.name) {
    fileUtil.delete('users', data.query.name, (err) => {
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

//main book route object
routeHandler._books = {};

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
    callback(404, { message: 'book not found', data: null });
  }
};

//Put route -- for updating a book
routeHandler._books.put = (data, callback) => {
  if (data.query.name) {
    fileUtil.update('books', data.query.name, data.payload, (err) => {
      if (!err) {
        callback(200, { message: 'book updated successfully' })
      } else {
        callback(400, { err: err, data: null, message: 'could not update book' });
      }
    });
  } else {
    callback(404, { message: 'book not found' });
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
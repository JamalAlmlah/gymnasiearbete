const bcrypt = require("bcrypt");
const connect = require("../models/connect");
const createUser = async (request, response) => {
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(request.body.Password, salt, async function(err, hash) {
      const user = {
        username: request.body.UserName,
        email: request.body.Email,
        password: hash
  
      }; 
      const db = await connect();
   
      const collection = db.collection("users");
    await collection.insertOne(user);
    response.sendStatus(204);
    });
    
  });  
  
  }
  const ucreateUser =  (request, response) => {
    if(request.cookies && request.cookies.admin) {
      response.render("registrera", {layout: "cp"});
    } else {
  
      response.redirect("/controlpanel/login");
    }
  }
  module.exports = {createUser, ucreateUser};

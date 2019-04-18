const bcrypt = require("bcrypt");
const connect = require("../models/connect");

/* logga in sida */ 
const createSession = async (request, response) => {
  console.log(connect);
  const db = await connect();
  const collection = db.collection("users");
  const login = await collection.find({ username: request.body.UserName })
    .toArray();

  bcrypt.compare(request.body.Password, login[0].password, function(
    err,
    res
  ) {
    if (res) {
      response.set("Set-Cookie", "admin=true;");
      response.redirect("/controlpanel");
    } else {
      response.render("login", {
        layout: "login",
        meddelande: "Fel användernamn eller lösenord"
      });
    }
  });
};
/* Lista på meddelande som vi får */ 
const viewmessage = async (request, response) => {
  const db = await connect();
  const collection = db.collection("messages");
  const messagescp = await collection.find().toArray();
  if (request.cookies && request.cookies.admin) {
    response.render("meddelande", { messages:messagescp, layout: "cp" });
  } else {
    response.redirect("/controlpanel/login");
  }
};
/* controlpanel sida */ 
const viewcp = (request, response) => {
  if (request.cookies && request.cookies.admin) {
    response.render("controlpanel", { layout: "cp" });
  } else {
    response.redirect("/controlpanel/login");
  }
};
/* logga in sida */ 
const viewlogin = (request, response) => {
  response.render("login", { layout: "login" });
};

module.exports = { createSession, viewmessage, viewcp, viewlogin };

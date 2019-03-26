const bcrypt = require("bcrypt");
const connect = require("../models/connect");

const createSession = async (request, response) => {
  const db = await connect();
  const collection = db.collection("users");
  const login = await collection
    .find({ username: request.body.UserName })
    .toArray();
  bcrypt.compare(request.body.Password, login[0].password, function(
    err,
    res
  ) {});
  bcrypt.compare(request.body.Password, login[0].password, function(err, res) {
    if (err) console.log(err);
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

const viewmessage = (request, response) => {
  if (request.cookies && request.cookies.admin) {
    response.render("meddelande", { layout: "cp" });
  } else {
    response.redirect("/controlpanel/login");
  }
};
const viewcp = (request, response) => {
  if (request.cookies && request.cookies.admin) {
    response.render("controlpanel", { layout: "cp" });
  } else {
    response.redirect("/controlpanel/login");
  }
};
const viewlogin = (request, response) => {
  response.render("login", { layout: "login" });
};

module.exports = { createSession, viewmessage, viewcp, viewlogin };

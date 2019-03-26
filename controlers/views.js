const multiparty = require("multiparty");
const connect = require("../models/connect");
const ObjectID = require("mongodb").ObjectID;

const viewabout = (request, response) => {
  response.render("about");
}
const viewcompany = async (request, response) => {
  const name = request.params.name;
  const db = await connect();
  const collection = db.collection("deals");
  const dealspost = await collection.find({ fnamn: name }).toArray();
  response.render("company", {
    deals: dealspost,
    fnamn: dealspost[0].fnamn
  });
}

const viewDeal = async (request, response) => {
  const id = request.params.id;
  const db = await connect();
  const collection = db.collection("deals");
  const dealspost = await collection.find({ _id: ObjectID(id) }).toArray();
  response.render("annonser", {
    deals: dealspost,
    fnamn: dealspost[0].fnamn
  });
}
const viewlogout = (request, response) => {
  response.set('Set-Cookie', 'admin=admin; expires=Thu, 01 Jan 1970 00:00:00 GMT');
  response.redirect("/controlpanel/login");
  }

  viewkontakta = (request, response) => {
    response.render("Kontakta");
  }
module.exports = {viewabout, viewcompany, viewlogout, viewkontakta, viewDeal};
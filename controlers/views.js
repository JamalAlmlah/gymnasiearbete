const multiparty = require("multiparty");
const connect = require("../models/connect");
const ObjectID = require("mongodb").ObjectID;
/* om oss sida  */

const viewabout = (request, response) => {
  response.render("about");
};
/* Sidan för företagets erbjudande */

const viewcompany = async (request, response) => {
  const name = request.params.name;
  const db = await connect();
  const collection = db.collection("deals");
  const dealspost = await collection.find({ fnamn: name }).toArray();
  response.render("company", {
    deals: dealspost,
    fnamn: dealspost[0].fnamn
  });
};
/* visa erbjudande i en ena sida */

const viewDeal = async (request, response) => {
  const id = request.params.id;
  const db = await connect();
  const collection = db.collection("deals");
  const dealspost = await collection.find({ _id: ObjectID(id) }).toArray();
  response.render("annonser", {
    deals: dealspost,
    fnamn: dealspost[0].fnamn
  });
};
/* logga ut funktion */

const viewlogout = (request, response) => {
  response.set(
    "Set-Cookie",
    "admin=admin; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  );
  response.redirect("/controlpanel/login");
};
/* kontatka oss sida */

const viewkontakta = (request, response) => {
  response.render("Kontakta");
};
/* kontakta oss sida "post" */
const skickakontakta = (request, response) => {};
module.exports = {
  viewabout,
  viewcompany,
  viewlogout,
  viewkontakta,
  skickakontakta,
  viewDeal
};

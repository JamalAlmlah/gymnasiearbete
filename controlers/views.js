const multiparty = require("multiparty");
const connect = require("../models/connect");
const ObjectID = require("mongodb").ObjectID;
/* om oss sida  */

const viewabout = (request, response) => {
  response.render("about", {layout: "nonemain"});
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
  response.render("Kontakta", {layout: "nonemain"});
};
const search = async (request, response) => {
  const search = request.query.search;
  const db = await connect();
  const collection = db.collection("deals");
  const searchresult =  await collection.find({ $text: { $search: search}}).toArray();

  response.render("home", {deals: searchresult} );
}
/* kontakta oss sida "post" */
const skickakontakta = async (request, response) => {
    const message = {

      firstname: request.body.firstname,
      lastname: request.body.lastname,
      email: request.body.email,
      meddelande: request.body.meddelande

    };
    const db = await connect();
    const collection = db.collection("messages");
    await collection.insertOne(messages);
    response.sendStatus(204);

  };

module.exports = {
  viewabout,
  viewcompany,
  viewlogout,
  viewkontakta,
  skickakontakta,
  viewDeal,
  search
};

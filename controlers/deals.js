const formidable = require("formidable");
const { ObjectID } = require("mongodb");
const connect = require("../models/connect");

/**
 * skapa erbjudande
 *
 * Denna funktion skapar erbjudande och spara de i databasen.
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */

const createDeals = async (request, response) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = "./public/uploads/";
  form.keepExtensions = true;

  form.parse(request, async (err, fields, files) => {
    if (err) {
      /* eslint-disable no-console */
      console.log("FIELDS ERROR", err.message);
      return;
    }
    const deals = {
      title: fields.title,
      text: fields.text,
      fnamn: fields.fnamn,
      pris: fields.pris,
      bild: files.file.path.split("\\")[2],
      excerpt: fields.text.slice(0, 100)
    };
    const company = {
      namn: fields.fnamn
    };
    const db = await connect();
    const collection = db.collection("deals");
    await collection.insertOne(deals);
    const companycollection = db.collection("company");
    await companycollection.insertOne(company);
    response.redirect("/controlpanel/skapaerbjudande");
  });
};

/**
 * Ändra erbjudande
 *
 * Denna funktion ändra färdiga erbjudande.
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */
const editDeals = async (request, response) => {
  const db = await connect();
  const collection = db.collection("deals");
  /* eslint-disable no-console */
  console.log({ request: request.params });
  const edit = request.params.id;
  await collection.findOneAndUpdate(
    {
      _id: ObjectID(edit)
    },
    {
      $set: {
        title: request.body.title,
        text: request.body.text,
        fnamn: request.body.fnamn
      }
    }
  );
  response.redirect("/controlpanel/erbjudande");
};
/**
 * skapa ernjudande sida "get"
 *
 * Denna funktion hämtar skapa erbjudande sida.
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */

const viewCreateDeals = (request, response) => {
  if (request.cookies && request.cookies.admin) {
    response.render("skapaerbjudande", { layout: "cp" });
  } else {
    response.redirect("/controlpanel/login");
  }
};

/**
 * visa erbjudande "home page"
 *
 * Denna funktion hämrar alla erbjudande som finns i databasen och visar i första sidan
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */

const viewDeals = async (request, response) => {
  const db = await connect();
  const collection = db.collection("deals");
  const dealspost = await collection
    .find()
    .sort({ _id: -1 })
    .toArray();

  response.render("home", {
    deals: dealspost
  });
};
/**
 * Ändra erbjudande "get"
 *
 * Denna funktion ändra erbjudande.
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */

const vieweditDeals = async (request, response) => {
  const edit = request.params.id;
  const db = await connect();
  const collection = db.collection("deals");
  const dealspost = await collection.findOne({ _id: ObjectID(edit) });
  console.log({ dealspost });
  if (request.cookies && request.cookies.admin) {
    response.render("edit", {
      deals: dealspost,
      layout: "cp"
    });
  } else {
    response.redirect("/controlpanel/login");
  }
};

/**
 * lista på erbjudande i controlpanel
 *
 * Denna funktion visar alla erbjudande i controlpanel.
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */

const viewDealscp = async (request, response) => {
  const db = await connect();
  const collection = db.collection("deals");
  const dealspost = await collection.find().toArray();
  if (request.cookies && request.cookies.admin) {
    response.render("erbjudande", { deals: dealspost, layout: "cp" });
  } else {
    response.redirect("/controlpanel/login");
  }
};
/* ta bort erbjudande från controlpanel */
/**
 * ta bort erbjudande från controlpanel
 *
 * Denna funktion tar bort erbjudande från båda controlpanel och databas
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */

const deletedeal = async (request, response) => {
  const tabort = request.params.id;
  const db = await connect();
  const collection = db.collection("deals");
  await collection.findOneAndDelete({ _id: ObjectID(tabort) });
  response.redirect("/controlpanel/erbjudande");
};
module.exports = {
  createDeals,
  editDeals,
  viewCreateDeals,
  viewDeals,
  vieweditDeals,
  viewDealscp,
  deletedeal
};

const formidable = require("formidable");
const connect = require("../models/connect");
const ObjectID = require("mongodb").ObjectID;
const fs = require("fs");

/* skapa erbjudande */

const createDeals = async (request, response) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = "./public/uploads/";
  form.keepExtensions = true;

  form.parse(request, async (err, fields, files) => {
    if (err) {
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

/* ändra erbjudande */

const editDeals = async (request, response) => {
  const db = await connect();
  const collection = db.collection("deals");
  console.log({ request: request.params });
  const edit = request.params._id;

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
  const companycollection = db.collection("deals");
  response.redirect("/controlpanel/erbjudande");
};
/* skapa erbjudande */

const viewCreateDeals = (request, response) => {
  if (request.cookies && request.cookies.admin) {
    response.render("skapaerbjudande", { layout: "cp" });
  } else {
    response.redirect("/controlpanel/login");
  }
};

/* visa erbjudande "home page" */
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
/* ändra erbjusande*/

const vieweditDeals = async (request, response) => {
  const edit = request.params._id;
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
/* lista på erbjudande i controlpanel */

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

const hej = "hej";

const deletedeal = async (request, response) => {
  const tabort = request.params._id;
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

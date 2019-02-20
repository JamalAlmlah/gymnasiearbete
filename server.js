const express = require("express");
const ObjectID = require("mongodb").ObjectID;
const handlebars = require("express-handlebars");
const bodyPaeser = require("./middlewares/bodyParser");
const app = express();
const connect = require("./models/connect");
app.use(bodyPaeser);
app.use("/static", express.static("public"));
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.post("/controlpanel/erbjudande/edit/:_id", async (request, response) => {
  const db = await connect();
  const collection = db.collection("deals");
  const edit = request.params._id;
  await collection.findOneAndUpdate({
    _id: ObjectID(edit)
  }, {
    $set: { title: request.body.title,
      text: request.body.text,
      fnamn: request.body.fnamn}
  });
  const companycollection = db.collection("deals");
  response.redirect("/controlpanel/erbjudande");

});

app.get("/", async (request, response) => {
  const db = await connect();
  const collection = db.collection("deals");
  const dealspost = await collection.find().toArray();
  response.render("home", {
    deals: dealspost
  });
});

app.get("/controlpanel/erbjudande", async (request, response) => {
  const db = await connect();
  const collection = db.collection("deals");
  const dealspost = await collection.find().toArray();
  response.render("erbjudande", { deals: dealspost, layout: "cp" });
});
app.post("/skapaerbjudande", async (request, response) => {
  const deals = {
    title: request.body.title,
    text: request.body.text,
    fnamn: request.body.fnamn
  };
  const company = {
    namn: request.body.fnamn
  };
  const db = await connect();
  const collection = db.collection("deals");
  await collection.insertOne(deals);
  const companycollection = db.collection("company");
  await companycollection.insertOne(company);
  response.redirect("/controlpanel/skapaerbjudande");
});
app.get("/controlpanel/skapaerbjudande", (request, response) => {
  response.render("skapaerbjudande", { layout: "cp" });
});
app.get("/kontakta", (request, response) => {
  response.render("Kontakta");
});

app.get("/controlpanel", (request, response) => {
  response.render("controlpanel", { layout: "cp" });
});
app.get("/controlpanel/meddelande", (request, response) => {
  response.render("meddelande", { layout: "cp" });
});
app.get("/controlpanel/login", (request, response) => {
  response.render("login", { layout: "" });
});
app.get("/company/:name", async (request, response) => {
  const name = request.params.name;
  const db = await connect();
  const collection = db.collection("deals");
  const dealspost = await collection.find({ fnamn: name }).toArray();
  response.render("company", {
    deals: dealspost,
    fnamn: dealspost[0].fnamn
  });
});

app.get("/controlpanel/erbjudande/tabort/:_id", async (request, response) => {
  const tabort = request.params._id;
  const db = await connect();
  const collection = db.collection("deals");
  await collection.findOneAndDelete({ _id: ObjectID(tabort) });
  response.redirect("/controlpanel/erbjudande");
});

app.get("/controlpanel/erbjudande/edit/:_id", async (request, response) => {
  const edit = request.params._id;
  const db = await connect();
  const collection = db.collection("deals");
  const dealspost = await collection.findOne({ _id: ObjectID(edit) });
  console.log({ dealspost });
  response.render("edit", {
    deals: dealspost,
    layout: "cp",
    
  });
});
app.listen(1111, () => console.log("Application running on port 1111"));

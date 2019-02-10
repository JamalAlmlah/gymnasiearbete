const express = require("express");
const handlebars = require("express-handlebars");
const bodyPaeser = require("./middlewares/bodyParser");
const app = express();
const connect = require("./models/connect");
app.use(bodyPaeser);
app.use("/static", express.static("public"));
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", async (request, response) => {
  const db = await connect();
  const collection = db.collection("deals");
  const dealspost = await collection.find().toArray();
  response.render("home", {
    deals: dealspost
  });
});
app.post("/skapaerbjudande", async (request, response) => {
  const deals = {
    title: request.body.title,
    text: request.body.text,
    fnamn: request.body.fnamn
  };
  const db = await connect();
  const collection = db.collection("deals");
  await collection.insertOne(deals);
  response.sendStatus(204);
});
app.get("/controlpanel/skapaerbjudande", (request, response) => {
  response.render("skapaerbjudande", { layout: "cp" });
});
app.get("/company", (request, response) => {
  response.render("company");
});
app.get("/controlpanel/erbjudande", (request, response) => {
  response.render("erbjudande", { layout: "cp" });
});
app.get("/controlpanel", (request, response) => {
  response.render("controlpanel", { layout: "cp" });
});
app.get("/controlpanel/meddelande", (request, response) => {
  response.render("meddelande", { layout: "cp" });
});
app.get("/controlpanel/login", (request, response) => {
  response.render("login", {layout: ""} );
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

app.listen(1111, () => console.log("Application running on port 1111"));

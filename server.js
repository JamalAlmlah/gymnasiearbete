const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("./middlewares/bodyParser");
const cookieParser = require("./middlewares/cookieParser");
const { createUser, ucreateUser } = require("./controlers/user");
const {
  createSession,
  viewmessage,
  viewcp,
  viewlogin
} = require("./controlers/session");
const {
  createDeals,
  editDeals,
  viewCreateDeals,
  viewDeals,
  vieweditDeals,
  viewDealscp,
  deletedeal
} = require("./controlers/deals");
const {
  skickakontakta,
  viewkontakta,
  viewabout,
  viewcompany,
  viewlogout,
  viewDeal,
  search
} = require("./controlers/views");

const app = express();

app.use(bodyParser);
app.use(cookieParser);
app.use("/static", express.static("public"));
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.post("/controlpanel/registrera", createUser);
app.post("/controlpanel/login", createSession);
app.post("/controlpanel/erbjudande/edit/:_id", editDeals);
app.post("/controlpanel/skapaerbjudande", createDeals);
app.post("/kontakta", skickakontakta);
app.get("/controlpanel/erbjudande", viewDealscp);
app.get("/controlpanel/skapaerbjudande", viewCreateDeals);
app.get("/", viewDeals);
app.get("/kontakta", viewkontakta);
app.get("/controlpanel/logout", viewlogout);
app.get("/about", viewabout);
app.get("/controlpanel/registrera", ucreateUser);
app.get("/controlpanel", viewcp);
app.get("/controlpanel/meddelande", viewmessage);
app.get("/controlpanel/login", viewlogin);
app.get("/company/:name", viewcompany);
app.get("/annonser/:id", viewDeal);
app.get("/controlpanel/erbjudande/tabort/:id", deletedeal);
app.get("/controlpanel/erbjudande/edit/:id", vieweditDeals);
app.get("/search", search);

/* eslint-disable no-console */
app.listen(1111, () => console.log("Application running on port 1111"));

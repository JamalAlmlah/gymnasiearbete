const express = require("express");
const ObjectID = require("mongodb").ObjectID;
const handlebars = require("express-handlebars");
const bodyParser = require("./middlewares/bodyParser");
const cookieParser = require("./middlewares/cookieParser");
const bcrypt = require("bcrypt");
const app = express();
const connect = require("./models/connect");
const {createUser,ucreateUser} = require("./controlers/user");
const {createSession,viewmessage, viewcp } = require("./controlers/session");
const {createDeals, editDeals, viewCreateDeals, viewDeals, VieweditDeal, viewDealscp, deletedeal} = require("./controlers/deals");
const {viewabout, viewlogin, viewcompany, viewlogout} = require("./controlers/views");


app.use(bodyParser);
app.use(cookieParser);
app.use("/static", express.static("public"));
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.post("/controlpanel/registrera", createUser);
app.post("/controlpanel/login", createSession);
app.post("/controlpanel/erbjudande/edit/:_id", editDeals);
app.get("/controlpanel/erbjudande", viewDealscp);
app.post("/skapaerbjudande", createDeals);
app.get("/controlpanel/skapaerbjudande", viewCreateDeals);
app.get("/", viewDeals);
app.get("/kontakta", viewkontakta);
app.get("/controlpanel/logout", viewlogout );
app.get("/about", viewabout);
app.get("/controlpanel/registrera", ucreateUser);
app.get("/controlpanel", viewcp);
app.get("/controlpanel/meddelande", viewmessage );
app.get("/controlpanel/login", viewlogin);
app.get("/company/:name", viewcompany );
app.get("/controlpanel/erbjudande/tabort/:_id", deletedeal);
app.get("/controlpanel/erbjudande/edit/:_id", vieweditDeal);
app.listen(1111, () => console.log("Application running on port 1111"));

const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
app.use("/static", express.static("public"));
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", (request, response) => {
  response.render("home");
});
app.post("/skapaerbjudande", (request, response) => {
  console.log('body', request.body);
  response.sendStatus(204);
});
app.get("/sida2", (request, response) => {
  response.render("second");
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
  response.render("controlpanel", { layout: "cp"});
});
app.get("/controlpanel/meddelande", (request, response) => {
response.render("meddelande", {layout: "cp"});
});
app.listen(1111, () => console.log("Application running on port 1111"));

const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
app.use('/static', express.static('public'));
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", (request, response) => {
  response.render("home");
});
app.get("/sida2", (request, response) => {
  response.render("second");
});

app.listen(1111, () => console.log("Application running on port 1111"));

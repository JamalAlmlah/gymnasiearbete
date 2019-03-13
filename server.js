const express = require("express");
const ObjectID = require("mongodb").ObjectID;
const handlebars = require("express-handlebars");
const bodyParser = require("./middlewares/bodyParser");
const cookieParser = require("./middlewares/cookieParser");
const bcrypt = require("bcrypt");
const multiparty = require("multiparty");
const app = express();
const connect = require("./models/connect");
app.use(bodyParser);
app.use(cookieParser);
app.use("/static", express.static("public"));
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.post("/controlpanel/registrera", async (request, response) => {
const saltRounds = 10;
bcrypt.genSalt(saltRounds, function(err, salt) {
  bcrypt.hash(request.body.Password, salt, async function(err, hash) {
    const user = {
      username: request.body.UserName,
      email: request.body.Email,
      password: hash

    }; 
    const db = await connect();
 
    const collection = db.collection("users");
  await collection.insertOne(user);
  response.sendStatus(204);
  });
  
});  

});

app.post("/controlpanel/login", async (request, response) => {
const db = await connect(); 
const collection = db.collection("users");
const login = await collection.find({username: request.body.UserName}).toArray();
console.log(login);
bcrypt.compare(request.body.Password, login[0].password, function(err, res) {
  if(res) { 
    response.set('Set-Cookie', 'admin=true;');
    response.redirect("/controlpanel")
  } else {

    response.render("login", { layout: "login", meddelande: "Fel användernamn eller lösenord" });

  } 
});



})

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
  if(request.cookies && request.cookies.admin) {
    response.render("erbjudande", { deals: dealspost, layout: "cp" });
  } else {
  
    response.redirect("/controlpanel/login");
  }
  
});
app.post("/skapaerbjudande", async (request, response) => {
  const form = new multiparty.Form(); 
  form.on('part', part => {
  if (!part.filename) {
  part.resume();
  }
  part.pipe(fs.createWriteStream(`./public/uploads${part.filename}`));
});
  form.parse(request, async (err, fields, files) => {
    const deals = {
    title: request.body.title,
    text: request.body.text,
    fnamn: request.body.fnamn
  };
  console.log(fields);
  console.log(err);
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
});
app.get("/controlpanel/skapaerbjudande", (request, response) => {

if(request.cookies && request.cookies.admin) {
  response.render("skapaerbjudande", { layout: "cp" });
} else {

  response.redirect("/controlpanel/login");
}


});
app.get("/kontakta", (request, response) => {
  response.render("Kontakta");
});

app.get("/controlpanel/logout", (request, response) => {
response.set('Set-Cookie', 'admin=admin; expires=Thu, 01 Jan 1970 00:00:00 GMT');
response.redirect("/controlpanel/login");
})

app.get("/about", (request, response) => {
  response.render("about");
});
app.get("/controlpanel/registrera", (request, response) => {
  if(request.cookies && request.cookies.admin) {
    response.render("registrera", {layout: "cp"});
  } else {

    response.redirect("/controlpanel/login");
  }
});

app.get("/controlpanel", (request, response) => {
  if(request.cookies && request.cookies.admin) {
    response.render("controlpanel", { layout: "cp" });
  } else {

    response.redirect("/controlpanel/login");
  }

});
app.get("/controlpanel/meddelande", (request, response) => {
  if(request.cookies && request.cookies.admin) {
    response.render("meddelande", { layout: "cp" });
  } else {
    response.redirect("/controlpanel/login");
  }
});
app.get("/controlpanel/login", (request, response) => {
  response.render("login", { layout: "login" });
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

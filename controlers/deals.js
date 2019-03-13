const multiparty = require("multiparty");
const connect = require("../models/connect");
const ObjectID = require("mongodb").ObjectID;

const createDeals =  async (request, response) => {
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
}
const editDeals =  async (request, response) => {
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
};

const viewCreateDeals = (request, response) => {
  if(request.cookies && request.cookies.admin) {
    response.render("skapaerbjudande", { layout: "cp" });
  } else {
    response.redirect("/controlpanel/login");
  }
  }

  const viewDeals = async (request, response) => {
    const db = await connect();
    const collection = db.collection("deals");
    const dealspost = await collection.find().toArray();
    response.render("home", {
      deals: dealspost
    });
  }

 const vieweditDeal =  async (request, response) => {
    const edit = request.params._id;
    const db = await connect();
    const collection = db.collection("deals");
    const dealspost = await collection.findOne({ _id: ObjectID(edit) });
    console.log({ dealspost });
    response.render("edit", {
      deals: dealspost,
      layout: "cp",
      
    });
  }
  const viewDealscp = async (request, response) => {
    const db = await connect();
    const collection = db.collection("deals");
    const dealspost = await collection.find().toArray();
    if(request.cookies && request.cookies.admin) {
      response.render("erbjudande", { deals: dealspost, layout: "cp" });
    } else {
      response.redirect("/controlpanel/login");
    }
  }

  const deletedeal = async (request, response) => {
    const tabort = request.params._id;
    const db = await connect();
    const collection = db.collection("deals");
    await collection.findOneAndDelete({ _id: ObjectID(tabort) });
    response.redirect("/controlpanel/erbjudande");
  }

module.exports = {createDeals, editDeals, viewCreateDeals, viewDeals, vieweditDeal, viewDealscp, deletedeal};

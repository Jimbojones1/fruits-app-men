const FruitModel = require("../models/fruit");

module.exports = {
  index: index,
  update: update,
  delete: deleteOne,
  edit: edit,
  new: newFruit,
  create: create,
  show: show,
};

// shortcut syntax if the key name and the value are the same!
// module.exports = {
// 	index,
// 	update,
// 	delete: deleteOne,
// 	edit,
// 	new: newFruit,
// 	create,
// 	show
// }

async function show(req, res) {
  // we need to go to the database to get the fruit by its id!, then inject into
  // the show.ejs
  try {
    const fruitDoc = await FruitModel.findById(req.params.fruitId);
    //  console.log(fruitDoc, " <--- Fruit Doc")
    res.render("fruits/show.ejs", { fruitDoc });
  } catch (err) {
    // or however you want to handle the error
    res.send(err);
  }
}

async function create(req, res) {
  // take the contents of the form,
  // console.log(req.body, " <--- req.body")
  // and put them in the database!

  // if(req.body.isReadyToEat === 'on'){
  // 	req.body.isReadyToEat = true;
  // } else {
  // 	req.body.isReadyToEat = false
  // }

  try {
    // This is the same as the if statement
    req.body.isReadyToEat = !!req.body.isReadyToEat;

    const fruit = await FruitModel.create(req.body);
    // console.log(fruit, " <- created fruit")

    // post we always direct to whereever you want
    // This is telling the client make a get request
    // to localhost:3000/fruits
    res.redirect("/fruits");
  } catch (err) {
	res.send(err)
  }
}

function newFruit(req, res) {
  // res render looks inside of the views folder for the template
  res.render("fruits/new.ejs");
}

async function edit(req, res) {
  const fruitDoc = await FruitModel.findById(req.params.fruitId);

  res.render("fruits/edit.ejs", { fruitDoc: fruitDoc });
}

async function deleteOne(req, res) {
  // we have to grab the id from the http request,
  // and pass it to our model so it go to the database
  // find the fruit and delete it
  try {
    const deletedFruit = await FruitModel.findByIdAndDelete(req.params.fruitId);
    console.log(deletedFruit);
    res.redirect("/fruits");
  } catch (err) {
    // decide to redirect/ or render a page, and show an error message
    res.send(err);
  }
}

// index, shows all of the resource
async function index(req, res) {
  // We need to go to the database and get every fruit
  const fruitDocs = await FruitModel.find({});
  // and show those fruits in our ejs page
  // console.log(fruitDocs, " <--- fruitDocs")
  // render is looking in the views folder to send back a template
  res.render("fruits/index.ejs", { fruitDocs: fruitDocs });
}

async function update(req, res) {
  req.body.isReadyToEat = !!req.body.isReadyToEat; // force 'on' or undefined for our checkbox to the boolean value
  // to match our model
  const editedFruit = await FruitModel.findByIdAndUpdate(
    req.params.fruitId,
    req.body,
    { new: true }
  );
  // {new: true} says return the updated copy from the db!
  console.log(editedFruit);

  // redirect to show page
  res.redirect(`/fruits/${req.params.fruitId}`);
}

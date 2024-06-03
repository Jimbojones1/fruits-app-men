const dotenv = require('dotenv');
dotenv.config();// loads the environment variable the server is started
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const methodOverride = require('method-override')
const path = require('path'); // comes with node so just have to require it
// ========= Import models
const FruitModel = require('./models/fruit')

const app = express()

mongoose.connect(process.env.MONGODB_URI)

// This function will fire once a connection between our express
// and mongodb atlas is confirmed
mongoose.connection.on('connected', function(){
	console.log(`Connected to Mongodb ${mongoose.connection.name}`)
})

//========= MiddleWare =============
app.use(express.urlencoded({extended: false})); // parses the form requests
app.use(morgan('dev'))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

app.put('/fruits/:fruitId', async function(req, res){
	req.body.isReadyToEat = !!req.body.isReadyToEat; // force 'on' or undefined for our checkbox to the boolean value
	// to match our model
	const editedFruit = await FruitModel.findByIdAndUpdate(req.params.fruitId, req.body, {new: true})
	// {new: true} says return the updated copy from the db!
	console.log(editedFruit)

	// redirect to show page
	res.redirect(`/fruits/${req.params.fruitId}`)

})


app.delete('/fruits/:fruitId', async function(req, res){
	// we have to grab the id from the http request, 
	// and pass it to our model so it go to the database
	// find the fruit and delete it 
	try {
		const deletedFruit = await FruitModel.findByIdAndDelete(req.params.fruitId)
		console.log(deletedFruit);
		res.redirect('/fruits')
	} catch(err){
		// decide to redirect/ or render a page, and show an error message
		res.send(err)
	}

})

app.get('/fruits/:fruitId/edit', async function(req, res){
	const fruitDoc = await FruitModel.findById(req.params.fruitId);

	res.render('fruits/edit.ejs', {fruitDoc: fruitDoc})
})

// to give us req.body!

// =================================

// Read Routes =================================================

// Index Route - We want a page that we can view all the fruits
app.get('/fruits', async function(req, res){

	// We need to go to the database and get every fruit
	const fruitDocs =  await FruitModel.find({})
	// and show those fruits in our ejs page
	// console.log(fruitDocs, " <--- fruitDocs")
	// render is looking in the views folder to send back a template
	res.render('fruits/index.ejs', {fruitDocs: fruitDocs})
})




// THE CREATE ROUTES ==============================================
// we want to be able to create a fruit!
// 1. (User) Get the Form ----- Server needs a route to respond with a form
app.get('/fruits/new', function(req, res){
	// res render looks inside of the views folder for the template
	res.render('fruits/new.ejs')
})
// 2. (User) Submit the Form --- Server needs a route to process the form submission
app.post('/fruits', async function(req, res){
	// take the contents of the form, 
	// console.log(req.body, " <--- req.body")
	// and put them in the database!

	// if(req.body.isReadyToEat === 'on'){
	// 	req.body.isReadyToEat = true;
	// } else {
	// 	req.body.isReadyToEat = false
	// }

	// This is the same as the if statement
	req.body.isReadyToEat = !!req.body.isReadyToEat
	
	const fruit = await FruitModel.create(req.body)
	// console.log(fruit, " <- created fruit")
	
	// post we always direct to whereever you want
	// This is telling the client make a get request
	// to localhost:3000/fruits
	res.redirect('/fruits')
})

// ==================================================


// Read Route (Show Route) - We want a page that we can view all the details of a single fruit
app.get('/fruits/:fruitId', async function(req, res){
    
	// we need to go to the database to get the fruit by its id!, then inject into 
	// the show.ejs
	const fruitDoc = await FruitModel.findById(req.params.fruitId)
	//  console.log(fruitDoc, " <--- Fruit Doc")
	 res.render('fruits/show.ejs', {fruitDoc: fruitDoc})
 })

// Landing Page ====================
app.get("/", function(req, res){
	res.render('index.ejs')
})
// ==================================================
app.listen(3000, function(){
	console.log('Listening on port 3000')
})
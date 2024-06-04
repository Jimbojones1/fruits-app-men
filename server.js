const dotenv = require('dotenv');
dotenv.config();// loads the environment variable the server is started
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const methodOverride = require('method-override')
const path = require('path'); // comes with node so just have to require it
// ========= Import models
const fruitsCtrl = require('./controllers/fruits')


const app = express()

// require the database file to make it run when the server starts up
require('./config/database')

//========= MiddleWare =============
app.use(express.urlencoded({extended: false})); // parses the form requests
app.use(morgan('dev'))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
// =================================


app.put('/fruits/:fruitId', fruitsCtrl.update)
app.delete('/fruits/:fruitId', fruitsCtrl.delete)
app.get('/fruits/:fruitId/edit', fruitsCtrl.edit)
// Read Routes =================================================
// Index Route - We want a page that we can view all the fruits
app.get('/fruits', fruitsCtrl.index)

// THE CREATE ROUTES ==============================================
// we want to be able to create a fruit!
// 1. (User) Get the Form ----- Server needs a route to respond with a form
app.get('/fruits/new', fruitsCtrl.new)
// 2. (User) Submit the Form --- Server needs a route to process the form submission
app.post('/fruits', fruitsCtrl.create)
// ==================================================

// Read Route (Show Route) - We want a page that we can view all the details of a single fruit
app.get('/fruits/:fruitId', fruitsCtrl.show)

// Landing Page ====================
app.get("/", function(req, res){
	res.render('index.ejs')
})
// ==================================================
app.listen(3000, function(){
	console.log('Listening on port 3000')
})
const mongoose = require('mongoose')

// The schema enforces the shape of the documents
// we are going to create
const fruitSchema = new mongoose.Schema({
	name: String, 
	isReadyToEat: Boolean
})
				// creates our fruits collection in mongodb
				// returns an object we are exporting as Fruit, 
				// which has all the crud methods attached to it
const Fruit = mongoose.model('Fruit', fruitSchema)

module.exports = Fruit;
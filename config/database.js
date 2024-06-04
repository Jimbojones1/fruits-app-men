const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)

// This function will fire once a connection between our express
// and mongodb atlas is confirmed
mongoose.connection.on('connected', function(){
	console.log(`Connected to Mongodb ${mongoose.connection.name}`)
})
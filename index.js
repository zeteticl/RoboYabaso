var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var jsonParser = bodyParser.json();
var channelAccessToken = process.env.LINE_CHANNEL_ACCESSTOKEN;
var channelSecret = process.env.LINE_CHANNEL_SECRET;
// Load `*.js` under modules directory as properties
//  i.e., `User.js` will become `exports['User']` or `exports.User`
require('fs').readdirSync(__dirname + '/modules/').forEach(function (file) {
	if (file.match(/\.js$/) !== null && file !== 'index.js') {
		var name = file.replace('.js', '');
		exports[name] = require('./modules/' + file);
	}
});

var options = {
	host: 'api.line.me',
	port: 443,
	path: '/v2/bot/message/reply',
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'Authorization': 'Bearer ' + channelAccessToken
	}
}
app.set('port', (process.env.PORT || 5000));
// views is directory for all template files
app.get('/', function (req, res) {
	//	res.send(parseInput(req.query.input));
	res.send('Hello');
});
app.post('/', jsonParser, function (req, res) {
	let event = req.body.events[0];
	let type = event.type;
	let msgType = event.message.type;
	let msg = event.message.text;
	let rplyToken = event.replyToken;
	let rplyVal = {};
	//console.log(msg);
	//訊息來到後, 會自動呼叫handleEvent 分類,然後跳到analytics.js進行骰組分析
	//如希望增加修改骰組,只要修改analytics.js的條件式 和ROLL內的骰組檔案即可,然後在HELP.JS 增加說明.
	try {
		rplyVal = handleEvent(event);
	}
	catch (e) {
		console.log('catch error');
		console.log('Request error: ' + e.message);
	}
	//把回應的內容,掉到replyMsgToLine.js傳出去
	if (rplyVal) {
		rplyVal.text = johndoe;
		exports.replyMsgToLine.replyMsgToLine(rplyToken, rplyVal, options);
	} else {
		//console.log('Do not trigger'); 
	}
	res.send('ok');
});

app.listen(app.get('port'), function () {
	console.log('Node app is running on port', app.get('port'));
});

function handleEvent(event) {
	switch (event.type) {
		case 'message':
			const message = event.message;
			switch (message.type) {
				case 'text':
					return exports.analytics.parseInput(event.rplyToken, event.message.text);
				default:
					break;
			}
		case 'follow':
			break;
		case 'unfollow':
			break;
		case 'join':
			break;
		case 'leave':
			break;
		case 'postback':
			break;
		case 'beacon':
			break;
		default:
			break;
	}
}


var mongoose = require("mongoose"); // The reason for this demo.

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.  
var uristring =
	process.env.MONGODB_URI ||
	'mongodb://localhost/HelloMongoose';

// The http server will listen to an appropriate port, or default to
// port 5000.
var theport = process.env.PORT || 5000;

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
	if (err) {
		console.log('ERROR connecting to: ' + uristring + '. ' + err);
	} else {
		console.log('Succeeded connected to: ' + uristring);
	}
});

// This is the schema.  Note the types, validation and trim
// statements.  They enforce useful constraints on the data.
var userSchema = new mongoose.Schema({
	name: {
		first: String,
		last: { type: String, trim: true }
	},
	age: { type: Number, min: 0 }
});

// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'PowerUsers' collection in the MongoDB database
var PUser = mongoose.model('PowerUsers', userSchema);

// Clear out old data
PUser.remove({}, function (err) {
	if (err) {
		console.log('error deleting old data.');
	}
});

// Creating one user.
var johndoe = new PUser({
	name: { first: 'John', last: 'Doe' },
	age: 25
});

// Saving it to the database.  
johndoe.save(function (err) { if (err) console.log('Error on save!') });

// Creating more users manually
var janedoe = new PUser({
	name: { first: 'Jane', last: 'Doe' },
	age: 65
});
janedoe.save(function (err) { if (err) console.log('Error on save!') });

// Creating more users manually
var alicesmith = new PUser({
	name: { first: 'Alice', last: 'Smith' },
	age: 45
});
alicesmith.save(function (err) { if (err) console.log('Error on save!') });



function createWebpage(req, res) {
	// Let's find all the documents
	PUser.find({}).exec(function (err, result) {
		if (!err) {
			let abc = {};
			abc.text = result;
			return abc;// Let's see if there are any senior citizens (older than 64) with the last name Doe using the query constructor
			//var query = PUser.find({ 'name.last': 'Doe' }); // (ok in this example, it's all entries)
			//query.where('age').gt(64);
		} else {
			res.end('Error in first query. ' + err)
		};
	});
}
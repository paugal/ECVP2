var http = require('http');
var url = require('url');
const WebSocket = require('websocket');
var express = require('express');
var bodyParser = require('body-parser');

//DATABASE
const Datastore = require('nedb');

const db = new Datastore('database.db');
db.loadDatabase();

const app = express();

//to handle static files, redirect to public folder
app.use(express.static('public'));

//to handle request of type GET to path '/'
app.get('/', function (req, res) {
  res.send('Hello World!');
});

//use all instead of get to accept any request type
app.all('/news', function (req, res) {
  res.send('Hello World!');
});

//to send manually a file (you can use the public folder)
app.get('/news', function (req, res) {
 res.sendFile( 'data/news.json', { root: __dirname });
});

//to launch
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


//to parse form data inside the request body we need this library
app.use( bodyParser.json() ); // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({extended: true}) ); //unicode

//example of a GET request with url parameters: /info?name=javi
app.get('/info', function (req, res) {
  var url_info = url.parse(req.url, true);
  res.send( JSON.stringify(url_info.query) ); //shows {"name":"javi"}
});

//to get url parameters from inside the path: /news/javi
app.get('/news/:user', function (req, res) {
 res.send( getNewsOfUser( req.params.user ) ); //user is javi
});

//example of a POST request with parameters inside the body from Form
app.post('/test', function (req, res) {
	console.log(req.body);
	res.send( JSON.stringify(req.body) );
	db.insert(req.body);
});















/*
{
var server = http.createServer(function(request, response){
	console.log('REQUEST: ' + request.url);
	var url_info = url.parse(request.url, true);
	var pathname = url_info.pathname;
	var params = url_info.query;
	response.end('OK!')
});

server.listen(1337, function(){
	console.log(`Server started on port ${server.address().port} :)`);
});

wsServer = new WebSocketServer({
	httpServer: server
});

wsServer.on('request', function(request){
	var connection = request.accept(null, request.origin);
	console.log('NEW WEBSOCKET USER!!!');
	connection.sendUTF('welcome!');
	connection.on('message', function(message){
		if(message.type === 'utf8'){
			console.log('NEW MSG: ' + message.utf8Data);
		}
	});

	connection.on('close', function(connection){
		console.log('USER IS GONE')
	})
});  
}*/
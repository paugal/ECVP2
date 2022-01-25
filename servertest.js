const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');
var bodyParser = require('body-parser');

var ids = 0;
//DATABASE
const Datastore = require('nedb');

const db = new Datastore('database.db');
db.loadDatabase();

msg = [{
    type: '',
    info: 0
    }
];

const wss = new WebSocket.Server({ server:server });

wss.on('connection', function connection(ws) {
  console.log('A new client Connected!');
  sendInitMsg(ws);
  

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
    
  });
});

function sendInitMsg(ws){
    msg = {type: 'init', info: ids}
    var data = JSON.stringify(msg);
    ids++;
    ws.send(data);
}

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

server.listen(3000, () => console.log(`Lisening on port :3000`));



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
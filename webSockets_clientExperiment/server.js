var http = require("http");
var path = require('path');
var url = require('url');
var fs = require('fs');
var WebSocketServer = require('ws').Server;
var currentMinutes;
// var actualMins = setInterval(currentMinutes, 1000);
//future time stamp
var futureTime = new Date(Date.UTC(2014, 3, 10, 5, 30, 0));
var futureTimeMins = futureTime.getMinutes();
//Constants
var WWW_ROOT = "./www/";
var HTTP_HOST = "localhost";
var HTTP_PORT = 8080;
var WS_PORT = 8081;
var mimeTypes = {
	"html": "text/html",
	"jpeg": "image/jpeg",
	"jpg": "image/jpeg",
	"png": "image/png",
	"js": "text/javascript",
	"css": "text/css"
};
http.createServer(function (req, res) {
	var fileToLoad;
	if (req.url == "/") {
		fileToLoad = "test.html";
	} else {
		//When index.html is uploaded url.parse.pathname automatically reads from what the client requests
		fileToLoad = url.parse(req.url).pathname.substr(1);
	}
	console.log("[HTTP] :: Loading :: " + WWW_ROOT + fileToLoad);
	var fileBytes;
	var httpStatusCode = 200;
	// check to make sure a file exists...takes a boolean
	fs.exists(WWW_ROOT + fileToLoad, function (doesItExist) {
		// if it doesn't exist lets make sure we load error404.html
		if (!doesItExist) {
			console.log("[HTTP] :: Error loading :: " + WWW_ROOT + fileToLoad);
			httpStatusCode = 404;
			fileToLoad = "error404.html";
		}
		var fileBytes = fs.readFileSync(WWW_ROOT + fileToLoad);
		//
		var mimeType = mimeTypes[path.extname(fileToLoad).split(".")[1]]; // complicated, eh?
		res.writeHead(httpStatusCode, {
			'Content-type': mimeType
		});
		res.end(fileBytes);
	});
}).listen(HTTP_PORT, HTTP_HOST);
console.log(futureTime);
console.log(futureTimeMins);
console.log(currentMinutes);
//Web sockets
var clients = [];
wss = new WebSocketServer({
	port: WS_PORT
});
// wss.on('connection', function (ws) {
// 	console.log("[WS] :: A new websocket connection was made!");
// });
wss.on('connection', function (ws) {
	ws.on('message', function (message) {
		// console.log('received: %s', message);
	});
	setInterval(function () {
		checkTime(ws)
	}, 1000);
});

function checkTime(ws) {
	// console.log("checking time!");
	var date = new Date();
	currentMinutes = date.getMinutes();
	if (currentMinutes == futureTimeMins) {
		var message = {
			"background-color": "red"
		};
		ws.send(JSON.stringify(message));
		console.log("Message was sent");
	} else {
		console.log("Message wasn't sent");
		console.log(currentMinutes);
	}
}
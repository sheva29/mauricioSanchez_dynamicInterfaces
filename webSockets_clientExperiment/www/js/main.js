var socket = new WebSocket('ws://localhost:8081/');
//We open a socket connection
socket.addEventListener("open", function (evt) {
	console.log("Socket Connection Opened!");
});
socket.addEventListener("message", function (evt) {
	console.log("[WS] :: Message received!");
	var jsonMessage = JSON.parse(evt.data);
	if (typeof jsonMessage == "string") {
		//We convert it back to 
		jsonMessage = JSON.parse(jsonMessage);
		console.log("We have received a color");
	}
	if (jsonMessage["background-color"] == "red") {
		document.getElementById("container").style.backgroundColor = "red";
		console.log(" The color has been changed");
	}
});
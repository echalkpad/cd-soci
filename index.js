var express = require('express');
var app = express(),
	server = require('http').createServer(app);

app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/bootstrap', express.static(__dirname + '/bootstrap'));

app.set('port', process.env.PORT || 5000);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

console.log("Listening for new clients on port 8080");

app.get('/', function (request, response){
	response.sendfile(__dirname + '/index.html');
});

app.post('/', function (request, response){


});

app.get('/user', function (request, response){

	response.sendfile(__dirname + '/index.html');

});


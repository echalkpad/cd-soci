
var app = express(),
	server = reqiore('http').createServer(app);

app.use('/js', express.static(__dirname + '/js'));

server.listen(8080);
console.log("Listening for new clients on port 8080");

app.get('/', function (request, response){
	respose.sendfile(__dirname + '/index.html');
});

app.post('/', function (request, response){


});

app.get('/user/:username', function (request, response){


});
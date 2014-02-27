var express = require('express');
var app = express(),
	server = require('http').createServer(app);

var fs = require('fs');
var AWS = require('aws-sdk');
// var lame = require('lame');
// var wav = require('wav');
// var exec = require('child_process').exec;

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

var s3 = new AWS.S3();

app.use(express.bodyParser());

app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/audio', express.static(__dirname + '/audio'));
app.use('/bootstrap', express.static(__dirname + '/bootstrap'));

app.set('port', process.env.PORT || 5000);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

console.log("Listening for new clients on port 8080");

app.get('/', function (request, response){
	response.sendfile(__dirname + '/index.html');
});

var message = 'j';

app.get('/newmessage', function (request, response){
  // send an HTTP header to the client:
  response.writeHead(200, {'Content-Type': 'text/html'});
  // send the data and close the connection:
  response.end(message);
  message = 'j';
});


app.get('/wakeup/*', function (request, response){

  message = request.params[0];  
  //console.log("AAAAAAAAAAAAreceived "+ message);

  // send an HTTP header to the client:
  response.writeHead(200, {'Content-Type': 'text/html'});
  // send the data and close the connection:
  response.end(message);
});

function convertFile(dirname){
	var cmd = 'lame *.wav myRecording.mp3';
	exec(cmd, {cwd: dirname+"/audio"}, function(error, stdout, stderr){
		if(error) {
			console.log("convertFile : " + error);
		} else {
			console.log("Successfully converted data ");
		}
	});	
}

function deleteOriginal(dirname){
	var cmd = 'rm -f *.wav';
	exec(cmd, {cwd: dirname+"/audio"}, function(error, stdout, stderr){
		if(error) {
			console.log("deleteOriginal: " + error);
		} else {
			console.log("Successfully deleted wav ");	
		}
	});	
}

function deletemp3(dirname){
	var cmd = 'rm -f myRecording.mp3';
	exec(cmd, {cwd: dirname+"/audio"}, function(error, stdout, stderr){
		if(error) {
			console.log("deleteOriginal: " + error);
		} else {
			console.log("Successfully deleted mp3 ");	
		}
	});	
}

app.post('/upload', function (request, response){

	console.log(request.body.filename);
	var s3bucket = new AWS.S3({params: {Bucket: 'socivoice'}});

	//var path = "audio/"+request.body.filename;
	//var filename = request.body.filename; // actual filename of file
	//var path = request.body.path; //will be put into a temp directory
	var path = "audio/myRecording.wav";
 	var filename = "myRecording.wav";    		
 	var mimeType = "audio/wav"; // image/jpeg or actual mime type

	//convertFile(__dirname);

	fs.readFile(path, function(err, file_buffer){
 
	 	// s3bucket.deleteObject({Bucket: 'socivoice', Key: "myRecording.mp3"}, function(err, data){
			// if( err) {
			// console.log("s3bucket deleteObject: "+ err);
			// }else{	
			// console.log("Successfully deleted data to s3 bucket");
			// }
   // 		});

	    var params = {
	      Key: filename,
	      Body: file_buffer,
	      ACL: 'public-read',
	      ContentType: mimeType
	    };
	    
	    // Put the Object in the Bucket
	    s3bucket.putObject(params, function(err, data) {

	      if (err) {
	        console.log("s3bucket putobject: " + err)
	 
	      } else {
	        console.log("Successfully uploaded data to s3 bucket");
	       	deleteOriginal(__dirname);
	    	deletemp3(__dirname);
	 
	      }
	 
	    });

	    //deleteOriginal(__dirname);
	    //deletemp3(__dirname);
	 
	  });

});

app.get('/upload', function (request, response){

	response.sendfile(__dirname + '/index.html');

});

app.get('/awaken', function (request, response){

	
	console.log("Im awaken!!!");
});


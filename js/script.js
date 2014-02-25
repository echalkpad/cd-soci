var tempData;

//Time handling**********************************************************

var currentTimeObj = new Date();
var initTime = {
		mm : currentTimeObj.getMonth()+1,
		dd : currentTimeObj.getDate(),
		hour : currentTimeObj.getHours(),
		minute : currentTimeObj.getMinutes(),
		second : currentTimeObj.getSeconds()
	};

var currentTime = {};
var leftTimeString;
var isTimetowakeup = false;
var isTimetonotice = false;
var isRecording = false;

function compareTime(timeObj){

	var calibMinute = timeObj.minute - currentTime.minute;

	//console.log(calibMinute + " left");
	
	var calibMinute = (timeObj.minute*60)-((currentTime.minute*60)+currentTime.second); 
	
	var leftMinute = Math.floor(calibMinute/60);
	var leftSecond = calibMinute -(leftMinute*60);
	var leftString;

	if(leftMinute == 0){
		isTimetonotice = true;
		leftTimeString = "<h4>Record and Send your voice.</h4>";
	}else if(leftMinute > 0){
		leftMinute = leftMinute + "m"; 
		leftSecond = leftSecond + "s";
		leftString = "left";
		leftTimeString = '<h4>'+leftString+' time: <span style="color:#CC2606;">'+leftMinute + " " +leftSecond+'</span></h4>';      	
	}else if(leftMinute < 0){
		isTimetowakeup = true;		
		leftMinute = Math.abs(leftMinute+1) + "m"; 	
		leftSecond = currentTime.second + "s";
		leftString = "passed";
		leftTimeString = '<h4>'+leftString+' time: <span style="color:#CC2606;">'+leftMinute + " " +leftSecond+'</span></h4>';      	
	}

	if(isTimetowakeup){
		$(".alert").empty();
		$(".alert").css('border','3px solid #FFFFFF');
		$(".alert").css('background-color', '#208db9');
		$(".alert").css('padding-top', '15px');
		$(".alert").css('padding-bottom', '14px');
		$(".alert").html("<h4 style='color: #FFFFFF;'>It's time to wake up Jess!</h4>");
	}

	if(isTimetonotice == true && isTimetowakeup == false){
		alert("It's time to wake up Jess!");
		isTimetonotice = false;
		isTimetowakeup = true;	
		addRecordButtons();		
	}
}

function addRecordButtons(){

	$("#friend-wakeup-time").append("<div id='btn-record'></div><div id='btn-stop'></div><div id='btn-play'></div><a id='save' href='#''><div id='btn-send'></div></a>");
	$("#btn-record").append("<img src ='img/record.png' width=70 />");
	$("#btn-stop").append("<img src ='img/stop.png' width=70 />");
	$("#btn-play").append("<img src ='img/play.png' width=70 />");
	$("#btn-send").append("<img src ='img/send.png' width=70 />");

}


function updateTime(){
	
	currentTimeObj = new Date();
	currentTime = {
		mm : currentTimeObj.getMonth(),
		dd : currentTimeObj.getDate(),
		hour : currentTimeObj.getHours(),
		minute : currentTimeObj.getMinutes(),
		second : currentTimeObj.getSeconds()
	};
	
	currentTime.mm = currentTime.mm+1;

	//console.log(currentTime);
	displayTime(currentTime);
	
	if(tempData == undefined){
		console.log("tempData is undefined");
	}else{
		compareTime(tempData.wakeupTime);
		//var timeHTML = '<h4 >left time: <span style="color:#CC2606;">'+leftTimeString+'</span></h4>';
       	if(isRecording == false) $('.leftTime').html(leftTimeString);
	}
}

function displayTime(timeObj){

	var displayM;
	var displayH;
	var displayP;

	if(timeObj.minute < 10){
		displayM = "0"+timeObj.minute;
	} else {
		displayM = timeObj.minute;
	}

	//console.log(timeObj.hour);
	if(timeObj.hour > 12){
		displayP = "PM";
		displayH = timeObj.hour-12;
	}else{
		displayP = "AM";
		displayH = timeObj.hour;
	}

	$("#clock").html("<span class='time' style='font-size:20px;'>"+displayH+":"+displayM+" "+displayP+"</span>");

}

function setFakeData(){

		//set a fake friend's data with a current time
	tempData = {
		"username": "Jess",
		"status": "sleeping",
		"wakeupCounter": "0",
		"wakeupTime": {
		    "mm": initTime.mm,
		    "dd": initTime.dd,
		    "hour": initTime.hour,
		    "minute": initTime.minute+2
		}    
	};

	//console.log("fake data:"+ tempData.wakeupTime.minute);

}

$(function(){

	setFakeData();
	//console.log(tempData.wakeupTime);

	//updateTime();
	setInterval(updateTime, 1000);
	var appUser;

	//user api definition ************************************************************** 


	var client = new Apigee.Client({
	    orgName: 'JessJJ', // Your Apigee.com username for App Services
	    appName: 'sandbox' // Your Apigee App Services app name

	});

	client.setToken(0);

    var users = new Apigee.Collection({
	    "client": client,
	    "type": "users",
	});

    var myStatus = new Apigee.Collection({
	    "client": client,
	    "type": "users/me",
	    "qs": {
	        "limit": 25
	    }
	});

	//user login part************************************************************** 

	client.getLoggedInUser(function(err, data, user) {
        if (err) {
                //error - could not get logged in user
            window.location = "#page-login";
            //console.log("err here");

        } else {
            if (client.isLoggedIn()) {
                appUser = user;
                loadMyStatus(appUser);
                console.log("user logined");

            }
        }
    });

        $('.buttonbar').on('click', '#btn-newuser', createUser);
        $('.buttonbar').on('click', '#btn-submit', login);

        function createUser() {
            var username = $("#form-new-username").val();
            var password = $("#form-new-password").val();
            client.signup(username, password, function(err, data) {
                if (err) {
                    console.log('FAIL')
                } else {
                    console.log('SUCCESS');
                    login(username, password);
                    $("#form-new-username").val('');
                    $("#form-new-password").val('');
                    $("#form-new-password").val('');
                    $("#form-new-email").val('');
                }
            });
        }

        function login(username, password) {
            $('#login-section-error').html('');

            if (username && password) {
                var username = username;
                var password = password;
            } else {
                var username = $("#form-username").val();
                var password = $("#form-password").val();
                console.log("in login:"+username+"/"+password);            
            }

            client.login(username, password,
                function(err) {
                    if (err) {
                        $('#login-section-error').html('There was an error logging you in.');
                        console.log(err)
                    } else {
                        //login succeeded
                        client.getLoggedInUser(function(err, data, user) {
                            if (err) {
                                //error - could not get logged in user
                            } else {
                                if (client.isLoggedIn()) {
                                    appUser = user;
                                }
                            }
                        });

                        //clear out the login form so it is empty if the user chooses to log out
                        $("#form-username").val('');
                        $("#form-password").val('');

                        window.location = "#page-main";
                        $("#page-login").css("display","none");
                        $("#page-main").css("display","inline-table");
                        loadMyStatus(myStatus);
                        renderFriendStatus(tempData);
                    }
                }
            );
        }

    function createTooltip(event){    
 
		
		$('li').append('<div class="tooltip" style="opacity:1;">'+tipString+'</div>');   
    	//$('<div class="tooltip">test</div>').appendTo('body');
    	positionTooltip(event);
    	onDiv = true;   
    	
    	setTimeout(function(){
    		$('.tooltip').remove();
    		onDiv = false;
    	}, 1000); 

	};

	function positionTooltip(event){
		//console.log("it's working!");  
    	var tPosX = event.pageX - 20;
    	var tPosY = event.pageY + 15;
    	$('div.tooltip').css({'position': 'absolute', 'top': tPosY, 'left': tPosX});
	};

   
	//default page loading from user data ************************************************
	
	loadItems(users);

	var tipString ="";
	var onDiv = false;

    function populateList(collection) {
	    $('#emojiList').empty();
	    while (collection.hasNextEntity()) {
	        var user = collection.getNextEntity();
	        if(user.get("status") === "sleeping"){
	        	$("#emojiList").append('<li id="'+user.get("username")+'" class="'+user.get("status")+'"><img src="img/zzz.png"/></li>');
	        }else if(user.get("status") === "awaken"){
	        	$("#emojiList").append('<li id="'+user.get("username")+'" class="'+user.get("status")+'"><img src="img/o.o.png"/></li>');
	        }

	    };

	    $("li").mouseenter(function(event){

			tipString = $(this).attr('id')+" is "+$(this).attr('class');
			
			if(onDiv == false) createTooltip(event);
		});
	}

	function loadMyStatus(collection){
	
		collection.fetch(
		function(err, data) {
			if(err) {
				alert("Read Your data failed.");
			}else {
				$('.jumbotron').empty();
				//console.log(data);
				renderMyStatus(collection);
			}
		});
	}

	function renderMyStatus(collection){

		$('.jumbotron').empty();
		$(".jumbotron").append('<div id="space" style= "height: 20px;"></div>');
        	
    	while (collection.hasNextEntity()) {
        	var user = collection.getNextEntity();
        	$(".jumbotron").append('<p class="lead">Hi, <strong>'+user.get("username")+'</strong>! Welcome to SOCI controller.<br/>You have <strong>'+1+'</strong> friend for social alarming.</p>');
        	var statusHTML = "";

        	if(user.get("status") === "sleeping"){
        		$(".emoji").attr('src',"img/zzz.png");
        		statusHTML = "<h4>Oh, aren't you</h4><br/><h1>"+user.get("status")+"?</h1>";
        	}else if(user.get("status") === "awaken"){
        		$(".emoji").attr('src',"img/o.o.png");
        		statusHTML = "<h4>You are </h4><br/><h1>"+user.get("status")+"</h1>";
        	}

        	$('#user-status').append(statusHTML);
        	//$("#user-wakeup-time").html(user.get("wakeupTime"));
        	$('#user-wakeup-time').append("<div class='wakeupTime'></div>");
        	$('.wakeupTime').append('<h4>Your wakeup time is <strong>'+user.get("wakeupTime").hour+':'+user.get("wakeupTime").minute+' '+user.get("wakeupTime").period+'</strong></h4>');

		};

	}

    function loadItems(collection) {
	    collection.fetch(
	        function(err, data) { // Success
	            if (err) {
	                alert("Read failed - loading offline data");
	                collection = client.restoreCollection(localStorage.getItem(collection));
	                collection.resetEntityPointer();
	                populateList(collection);
	            } else {
	                populateList(collection);
	                localStorage.setItem(collection, collection.serialize());
	                //console.log(collection.serialize());

	            }
	        }
	    );
	}

	//get a friend's data of the logged user(fake) ************************************************
	
	function renderFriendStatus(data){

		//console.log(data.username + "is on");
		if(data.status === "sleeping"){
			console.log("sleeping");
        		$(".friend-emoji").attr('src',"img/zzz.png");
        }else if(data.status === "awaken"){
        		$(".friend-emoji").attr('src',"img/o.o.png");
        }

        statusHTML = "<h4><strong>"+data.username+"</strong> is</h4><br/><h1>"+data.status+"</h1>";
       	$('#friend-status').append(statusHTML);
      	$('#friend-wakeup-time').append("<div class='leftTime'></div>");
       	$('#friend-wakeup-time').append("<div class='alert'><h4>You can't send an alarm now!</h4></div>");
       	
	}

    //audio handling part**********************************************

    window.AudioContext = window.AudioContext || window.webkitAudioContext;

	var audioContext = new AudioContext();
	var audioInput = null,
	    realAudioInput = null,
	    inputPoint = null,
	    audioRecorder = null;
	var rafID = null;
	var analyserContext = null;
	var canvasWidth, canvasHeight;
	var recIndex = 0;

   	$('#friend-wakeup-time').on('click', '#btn-record', startRecording);
    $('#friend-wakeup-time').on('click', '#btn-stop', stopRecording);
   	$('#friend-wakeup-time').on('click', '#btn-play', playBack);
    $('#friend-wakeup-time').on('click', '#btn-send', sendRecordedVoice);

    function gotBuffers( buffers ) {

	    audioRecorder.exportWAV( doneEncoding );
	}

	function doneEncoding( blob ) {
	    Recorder.setupDownload( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
	    recIndex++;
	}

    function startRecording(){
    	console.log("start Recording");

    	isRecording = true;

    	$('.leftTime').html("Recording.....");
    	if (!audioRecorder)
            return;
        audioRecorder.clear();
        audioRecorder.record();
    }
    function stopRecording(){
    	console.log("stop Recording");
    	$('.leftTime').html("Recording is done");
    	setTimeout(function(){ $('.leftTime').html("Double-click the send button!");}, 2000);
    	
    	audioRecorder.stop();
        audioRecorder.getBuffers( gotBuffers );
    }
    function playBack(){
    	console.log("play Recorded File");

    	//Not working yet!!!!!!!!!!!!!!!!!!!!!!
    }
    function sendRecordedVoice(){
    	console.log("Double-click the send button!");
    	$('.leftTime').html("Send to your Friend");
    	setTimeout(function(){ $('.leftTime').html("Successfully sent!");}, 2000);
    	setTimeout(function(){ isRecording = false;}, 5000);
    	
    	wakeUp();
    	audioRecorder.exportWAV( doneEncoding );

    }	

    function wakeUp() {
	$.get("/wakeup/y");
	console.log("wakeUp is working");
    }

    function convertToMono( input ) {
	    var splitter = audioContext.createChannelSplitter(2);
	    var merger = audioContext.createChannelMerger(2);

	    input.connect( splitter );
	    splitter.connect( merger, 0, 0 );
	    splitter.connect( merger, 0, 1 );
	    return merger;
	}
	function toggleMono() {
	    if (audioInput != realAudioInput) {
	        audioInput.disconnect();
	        realAudioInput.disconnect();
	        audioInput = realAudioInput;
	    } else {
	        realAudioInput.disconnect();
	        audioInput = convertToMono( realAudioInput );
	    }

	    audioInput.connect(inputPoint);
	}

	function gotStream(stream) {
	    inputPoint = audioContext.createGain();

	    // Create an AudioNode from the stream.
	    realAudioInput = audioContext.createMediaStreamSource(stream);
	    audioInput = realAudioInput;
	    audioInput.connect(inputPoint);

	//    audioInput = convertToMono( input );

	    analyserNode = audioContext.createAnalyser();
	    analyserNode.fftSize = 2048;
	    inputPoint.connect( analyserNode );

	    audioRecorder = new Recorder( inputPoint );

	    zeroGain = audioContext.createGain();
	    zeroGain.gain.value = 0.0;
	    inputPoint.connect( zeroGain );
	    zeroGain.connect( audioContext.destination );
	}

	function initAudio() {
	        if (!navigator.getUserMedia)
	            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	        if (!navigator.cancelAnimationFrame)
	            navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
	        if (!navigator.requestAnimationFrame)
	            navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

	    navigator.getUserMedia({audio:true}, gotStream, function(e) {
	            alert('Error getting audio');
	            console.log(e);
	        });
	}

	window.addEventListener('load', initAudio );

});

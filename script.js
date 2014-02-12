function setup(){

}

function startRecording(selector){

	//capture voice



	//change button status

	//console.log(selector.parentNode.firstChild.nextSibling);
	selector.parentNode.firstChild.nextSibling.innerHTML = "Recording...";
	selector.id = "pause";
	selector.setAttribute("onclick", "stopRecording(this)");
	selector.innerHTML = '<img src="img/stop.png"/>';


}

function stopRecording(selector){

	//console.log(selector);

	selector.parentNode.firstChild.nextSibling.innerHTML = "Recording is done";
	selector.id = "play";
	selector.setAttribute("onclick", "playback(this)");
	selector.innerHTML = '<img src="img/play.png"/>';
	//console.log(selector.parentNode.lastChild.previousSibling);
	selector.parentNode.lastChild.previousSibling.style.visibility = "visible";

}

function playback(){

	//playback the sound

}

function sendVoice(selector){



	console.log(selector);
	console.log(selector.parentNode.childNodes[3]);


	selector.parentNode.childNodes[1].innerHTML = "Sending...";
	selector.style.visibility = "hidden";
	selector.parentNode.childNodes[3].id = "record";
	selector.parentNode.childNodes[3].setAttribute("onclick", "startRecording(this)");
	selector.parentNode.childNodes[3].innerHTML = '<img src="img/record.png"/>';


	setTimeout(function(){ 
		selector.parentNode.childNodes[1].innerHTML = "Delivered";
	}, 2000);
	setTimeout(function(){ 
		selector.parentNode.childNodes[1].innerHTML = "Start Recording";
		setup();
	}, 3000);

}


var wakeupList = [
	{
		name:"Jess", 
		wakeupH:"3", 
		wakeupM:"20",
		wakeupP:"PM",
		status:"sleeping",
		counter: 0
	},
	{
		name:"Maria", 
		wakeupH:"5", 
		wakeupM:"27",
		wakeupP:"PM",
		status:"sleeping",
		counter: 0
	},
	{
		name:"Tom",
		wakeupH:"9",
		wakeupM:"30",
		status:"awakening",
		counter: 0
	}			
];

var tempDate = {
	name:"", 
	wakeupH:"", 
	wakeupM:""
};

var currentTime = new Date();
var currentH = currentTime.getHours();
var currentM = currentTime.getMinutes();
var currentS = currentTime.getSeconds();
var currentP = "";

function setup(){

	setInterval(function(){ updateTime(); renderFriends();}, 1000);
	//console.log(tempDate);
	renderFriends();
}

function updateTime(){

	currentTime = new Date();
	currentH = currentTime.getHours();
	currentM = currentTime.getMinutes();
	currentS = currentTime.getSeconds();
	currentP = "";

	currentM = checkTime(currentM);
	currentS = checkTime(currentS);

	if(currentH > 12){
		currentH = currentH-12;
		currentP = "PM";
	}else{
		currentP = "AM";
	}
	clock.innerHTML= "<span class='time' style='font-size:20px;'>"+currentH+":"+currentM+":"+currentS+currentP+"</span>";

}


function checkTime(i)
{
	if (i<10)
	  {
	  i="0" + i;
	  }
	return i;
}

function renderFriends(){

for(var i=0; i<wakeupList.length; i++){

	var userStatus = document.getElementById("user"+i);
	var leftH = wakeupList[i].wakeupH - currentH;
	var leftM = wakeupList[i].wakeupM - currentM;
	//console.log(userStatus.childNodes);

	var tempText = "";

	//console.log(leftM);

if(wakeupList[i].status === "sleeping"){	

	userStatus.childNodes[5].innerHTML = '<img class="emoji" src="img/zzz.png"/>';
		if(leftH > 0){
			if(leftM >= 0){
				tempText = wakeupList[i].name+'<span class="status"> is sleeping right now. <br/><span class="time">'+leftH+"h and "+leftM+' min</span> left to wake up. </span>';
			}else if(leftM < 0){
				leftH = leftH -1;
				leftM = 60+leftM;
				leftM = Math.abs(leftM);
				tempText = wakeupList[i].name+'<span class="status"> is sleeping right now. <br/><span class="time">'+leftH+"h and "+leftM+' min</span> left to wake up. </span>';
			}

		}else if(leftH == 0){

			if(leftM > 0){
				tempText = wakeupList[i].name+'<span class="status"> is sleeping right now. <br/><span class="time">'+leftM+' min</span> left to wake up. </span>';
			}else if(leftM < 0){
				leftM = Math.abs(leftM);
				leftM = leftM;
				tempText = wakeupList[i].name+'<span class="status"> is sleeping right now. <br/><span class="time">'+leftM+' min</span> over to wake up. </span>';
			}else if(leftM == 0){
				tempText = wakeupList[i].name+'<span class="status"> is sleeping right now. <br/><span class="time">Time to wake up!</span></span>';
			}

		}else{

			if(leftM > 0){
					leftH = Math.abs(leftH);
					leftM = Math.abs(leftM);
					tempText = wakeupList[i].name+'<span class="status"> is sleeping right now. <br/><span class="time">'+leftH+"h and "+leftM+' min</span> over to wake up. </span>';
			}else if(leftM < 0){
					leftH = Math.abs(leftH);
					leftM = Math.abs(leftM);
					tempText = wakeupList[i].name+'<span class="status"> is sleeping right now. <br/><span class="time">'+leftH+"h and "+leftM+' min</span> over to wake up. </span>';
			}

		}
	
}else if(wakeupList[i].status === "awakening"){

			//console.log(userStatus.childNodes);

			if(userStatus.childNodes.length > 7){
				userStatus.childNodes[7].innerHTML = "";
			}

			tempText = wakeupList[i].name+'<span class="status"> is awaken <br/> What about texting or calling?</span><br/> <span class="time">+1 347 369 0008</span></p>';
			userStatus.childNodes[5].src = "img/o.o.png";
			//console.log(userStatus.childNodes[5]);

		}

	userStatus.childNodes[3].innerHTML = tempText;
	
	}

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
		selector.parentNode.childNodes[1].innerHTML = "You already recorded";
		setup();
	}, 3000);

}


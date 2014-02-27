/*Soci Alarm Clock
created by Maria Paula Saba and Jess Jiyoung
as assignment for Connected Devices and Networked Interaction class
taught by Tom Igoe, ITP Spring 2014 

In this code, the arduino talks to a node server and when it is time,
downloads an audio file from the server and plays it while the soft 
switch is pressed.

*/



#include <Process.h>
#include <Bridge.h>
#include <HttpClient.h>
#include <Adafruit_NeoPixel.h>

String address;
String file;
int incomingByte;
int command = 0;
boolean playing;
boolean checkPlay, checkStop;
Process p;

int buttonState;
const int softButton = 7;
const int ledPin = 13;
const int RGBled = 6;
Adafruit_NeoPixel strip = Adafruit_NeoPixel(1, RGBled, NEO_GRB + NEO_KHZ800);
unsigned long time;


void setup() {
  //to test with serial commands
  incomingByte = 0;
  
  Bridge.begin();
  Serial.begin(57600);
  //while(!Serial);
  //Serial.println("I'm here");

  //our server address
  address = "https://s3.amazonaws.com/socivoice/myRecording.mp3";
  //name the file will be saved as
  file = "myRecording.mp3";
  
  //status variables
  playing = false;
  checkPlay = false;
  checkStop = false;

  //hardware
  pinMode(softButton, INPUT);   
  pinMode(ledPin, OUTPUT);    
  strip.begin();
  strip.show();
}

void loop(){
  HttpClient client;
  
  //read the soft switch state
  buttonState = digitalRead(softButton);
  
  //check if there is any serial messages coming
  while (Serial.available() > 0) {
    incomingByte = Serial.read(); 
  }

  if(!playing){
    //keep checking if there is a new message
    client.get("http://socialarmclock.herokuapp.com/newmessage");
    while (client.available()) {
      command = client.read();
    }
    
    //change LED color according to the soft switch
    if(buttonState == HIGH){
      strip.setPixelColor(0 , strip.Color(0, 100,255));
      strip.show();
    }
    else{
      strip.setPixelColor(0 , strip.Color(0, 0,255));
      strip.show();   
    }

      //client sends "new message"    
       if(command == 'y' || incomingByte == 100){  
      //downlaod file
      Serial.println("let's download!");  
      p.runShellCommand("curl --insecure -o /mnt/sda1/"+file + " "+ address);
      while(p.running());  
      Serial.println("just downloaded!to /mnt/sda1/"+file + " "+ address); 
      playing = true;  
      checkPlay = true;
      }
      else{
      playing = false;
      checkPlay = false;
      checkStop = false;
      }
  }

  else{    
    if(checkPlay){
      //yellow
      strip.setPixelColor(0 , strip.Color(255, 255,0));
      strip.show();  

      //is person is still there? 
      if(buttonState == HIGH){
        Serial.println("let's play!");  
        p.begin("madplay");
        p.addParameter("--tty-control");
        p.addParameter("/mnt/sda1/"+file);    
        p.runAsynchronously();
        checkPlay =false;
        checkStop = true;
        prevTime = millis();  
      }
    }

    //if person still sleeping 
    if(checkStop){
      //red
      strip.setPixelColor(0 , strip.Color(255, 0,0));
      strip.show(); 
      
      //person woke up!!!!
      if(buttonState == LOW){    
        p.runShellCommandAsynchronously("Q");  
        Serial.println("just quit!"); 
        checkPlay = true;
        checkStop = false;     
        //client.get("http://socialarmclock.herokuapp.com/awaken");
      }
      else{
       //this makes the recording play again every 5 seconds 
       time = millis();
       
       if(time%5000 == 0){
        checkPlay = true;
        checkStop = false;   
        Serial.println("checking play again");
       }
      
      }
    }

  }

  //reseting the serial
  incomingByte = 0;

}















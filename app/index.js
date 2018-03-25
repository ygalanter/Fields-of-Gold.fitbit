// importing libraries
import clock from "clock";
import document from "document";
import * as messaging from "messaging";
import * as fs from "fs";
import { me } from "appbit";
import {preferences} from "user-settings";
import dtlib from "../common/datetimelib";
import { inbox } from "file-transfer"

// Get UI elements
let h1img = document.getElementById("h1");
let h2img = document.getElementById("h2");
let m1img = document.getElementById("m1");
let m2img = document.getElementById("m2");

let shade = document.getElementById("shade");
let backimg = document.getElementById("back");
let frontimg = document.getElementById("front");


function checkIncomingFile(){
  var fileName;
  do {
    // If there is a file, move it from staging into the application folder
    fileName = inbox.nextFile();
    if (fileName) {
      console.log("/private/data/" + fileName + " is now available");
      
      //setting custom image
      userSettings.image = "/private/data/" + fileName;
      backimg.href = userSettings.image;
      frontimg.href = backimg.href
      
      //rermoving previous version
      let fileCounter = parseInt(fileName.split(".")[0])
      if (fileCounter > 1) {
        fs.unlinkSync(`${fileCounter-1}.txi`);
        console.log(`Deleted old file ${fileCounter-1}.txi`)
      }
      
    }
  } while (fileName);
  
}

checkIncomingFile();


// Event occurs when new file(s) are received
inbox.onnewfile = function () {
  checkIncomingFile()
};



// on app exit collect settings 
me.onunload = () => {
  fs.writeFileSync("user_settings.json", userSettings, "json");
}

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.close = () => {
  console.log("App Socket Closed");
};

// Message is received
messaging.peerSocket.onmessage = evt => {

  switch (evt.data.key) {
     case "image":
          userSettings.image = JSON.parse(evt.data.newValue).values[0].value;
          backimg.href = userSettings.image;
          frontimg.href = backimg.href
          break;
    case "shade":
          userSettings.shade = parseFloat(JSON.parse(evt.data.newValue));
          console.log(userSettings.shade);
          shade.style.opacity = userSettings.shade;
          break;
  };
}


// trying to get user settings if saved before
let userSettings;
try {
  userSettings = fs.readFileSync("user_settings.json", "json");
} catch (e) {
  userSettings = {shade: 0.7, image: "images/seasunset.jpg"}
}


//trap
if (!userSettings.shade) {
  userSettings = {shade: 0.7, image: "images/seasunset.jpg"}
}

// initial color and icon settings
shade.style.opacity = userSettings.shade;
backimg.href = userSettings.image;
frontimg.href = backimg.href


// get user time format preference
dtlib.timeFormat = preferences.clockDisplay == "12h" ? 1: 0;

// Update the clock every minute
clock.granularity = "minutes"; 




// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
   let today = evt.date;
   
  // obtaining hours in user-preferred format and split them into 2 digits
  let hours = dtlib.format1224hour(today.getHours());
  let h1 = Math.floor(hours/10);
  let h2 = hours % 10;
    
  // obtaining minutes and split them into 2 digits
  let mins = today.getMinutes();
  let m1 = Math.floor(mins/10);
  let m2 = mins % 10;
  
  h1img.href = `digits/${h1}.png`; h2img.href = `digits/${h2}.png`;
  m1img.href = `digits/${m1}.png`; m2img.href = `digits/${m2}.png`;
  
}

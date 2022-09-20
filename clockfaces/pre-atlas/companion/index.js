import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { device } from "peer";
import { outbox } from "file-transfer"
import { readPNG, convertPNGtoTXI } from "../common/ImageConverter.js";
import { base64decode } from "../common/base64.js"

console.log("Companion Started");

if (!device.screen) device.screen = { width: 348, height: 250 };
settingsStorage.setItem("screenWidth", device.screen.width);
settingsStorage.setItem("screenHeight", device.screen.height);


//filecounter cache buster
var fileCounter = 0;
settingsStorage.setItem("fileCounter", fileCounter);

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("Companion Socket Open");
  restoreSettings();
};

// Message socket closes
messaging.peerSocket.close = () => {
  console.log("Companion Socket Closed");
};

// A user changes settings
settingsStorage.onchange = evt => {
  if (evt.key === "customimage") {
    let data = JSON.parse(evt.newValue);
    if (data && data.image && data.image.imageString) {
    
      readPNG(base64decode(data.image.imageString)).then(data => {
             return convertPNGtoTXI(data)
          }).then(data => {
              fileCounter = parseInt(settingsStorage.getItem("fileCounter")) + 1;
              return outbox.enqueue(`${fileCounter}.txi`, data).then(function (ft) {
                // Queued successfully
                console.log(`Transfer of ${fileCounter}.txi successfully queued.`);
                settingsStorage.removeItem('image'); // clearing pre-set selection
                settingsStorage.setItem("fileCounter", fileCounter); 
              }).catch(function (error) {
                // Failed to queue
                throw new Error("Failed to transfer image. Error: " + error);
              });
          })
      
      
    }
  } else {
    //sending to device
    let data = {
      key: evt.key,
      newValue: evt.newValue
    };
    sendVal(data);
  }
};

// Restore any previously saved settings and send to the device
function restoreSettings() {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key && key != 'customimage' ) { //not restoring custom image
      let data = {
        key: key,
        newValue: settingsStorage.getItem(key)
      };
      sendVal(data);
    }
  }
}

// Send data to device using Messaging API
function sendVal(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}
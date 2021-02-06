"use strict";

// differentiate between Id (-> complicated) and Name(-> short), because these are the keys from metadata
// BUT: sensorID is a key in the message from Node-RED, so not changable to "name"

let allSensors = []; // fill with Names when message arrives (can't show info otherwise anyways)
let sensorName; //metadata name
//let sensorId; //metadata id
let selSensor // hovered id recognized as sensor 
let id = null; // id of selected/ hovered object (not just sensors)
let sensor; // Names send by Michael, elements of "allSensors"
let messageID = "";

// should those be in functions?
let iframe = document.getElementById('embeddedViewer');
let viewer = iframe.contentWindow.bimViewer.viewer;
let metaObjects = viewer.metaScene.metaObjects;
//let ObjectList = Object.entries(metaObjects); // --> neccessary?
const allObjects = Object.values(metaObjects);
var objArray = [];


function show_some_information_init() {

    
    allObjects.forEach(function(element){
        var newLength = objArray.push([element.type, element.name, element.id]); 
        
    });

    iframe.onload = function () {
        //get id of selected object
        viewer.cameraControl.on("hover", (e) => {
            id = e.entity.id;
        });
        
        // get name by id
        objArray.forEach(function(element){
            if (element.includes(id)){
                sensorName = element[1];
            }
        });
        
        //filter sensors from other objects
        viewer.scene.input.on("mouseup", e => {
            if (allSensors.includes(sensorName)) {
                selSensor = id;
            }
            console.log(id);
        });

    }
}

function update_info(message) {
    console.log(message);
    // add sensor name to the pool of sensors (to enable the hovering in other function)
    let newSensorName = allSensors.push(message.sensorID);

    allObjects.forEach(function(element){
        var newLength = objArray.push([element.type, element.name, element.id]); 
        
    });
    objArray.forEach(function(element){
        if (element.includes(message.sensorID)){
            messageID = element[0]
        }
    });
    if (message.sensorID === current_sensor_ID) {
        let div_info = document.getElementById("information");
        let p_info = document.createElement("P");
        let time = new Date().toISOString();
        let text = document.createTextNode("" + time);
        let br = document.createElement("br");
        p_info.appendChild(text);
        p_info.appendChild(br);

        Object.keys(message).forEach(function (key) {
            let text = document.createTextNode("  "+key + ": " + message[key]);
            let br = document.createElement("br");
            p_info.appendChild(text);
            p_info.appendChild(br);

        });
        div_info.appendChild(p_info);
        div_info.scrollTop = div_info.scrollHeight;
    }
}

function clear_div_info(){

    let div_info = document.getElementById("information");
    while (div_info.firstChild) {
        div_info.removeChild(div_info.firstChild);
    }
}
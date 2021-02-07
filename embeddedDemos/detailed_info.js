"use strict";

// differentiate between Id (-> complicated) and Name(-> short), because these are the keys from metadata
// BUT: sensorID is a key in the message from Node-RED, so not changable to "name"

let allSensors = []; // fill with Names when message arrives (can't show info otherwise anyways)
let sensorName; //metadata name
//let sensorId; //metadata id
let selSensor // hovered id recognized as sensor 
let id = null; // id of selected/ hovered object (not just sensors)
let sensorID; // Names send by Michael, elements of "allSensors"
let messageID = "";
var objArray = [];

function show_some_information_init() {


    let iframe = document.getElementById('embeddedViewer');
    let viewer = iframe.contentWindow.bimViewer.viewer;
    let metaObjects = viewer.metaScene.metaObjects;
    //let ObjectList = Object.entries(metaObjects); // --> neccessary?
    const allObjects = Object.values(metaObjects);

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
        

        //filter sensors from other objects --> the allSensors array builds up with arriving messages

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

    sensorID = message.sensorID;
    console.log(message.sensorID);


    let iframe = document.getElementById('embeddedViewer');
    let viewer = iframe.contentWindow.bimViewer.viewer;
    let metaObjects = viewer.metaScene.metaObjects;
    //let ObjectList = Object.entries(metaObjects); // --> neccessary?
    const allObjects = Object.values(metaObjects);

    // add sensor name to the pool of sensors (to enable the hovering in other function)
    if (!allSensors.includes(sensorID)){
        let newSensorName = allSensors.push(sensorID);
    }
    console.log(allSensors);
    console.log(allObjects);
    allObjects.forEach(function(element){
        var newLength = objArray.push([element.type, element.name, element.id]); 
        
    });
    objArray.forEach(function(element){
        if (element.includes(message.sensorID)){
            messageID = element[0]
        }
    });
    if (message.sensorID === selSensor) {
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
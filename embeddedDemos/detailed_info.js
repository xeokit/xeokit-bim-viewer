"use strict";

// differentiate between Id (-> complicated) and Name(-> short), because these are the keys from metadata
// BUT: sensorID is a key in the message from Node-RED, so not changable to "name"

let allSensors = []; // fill with Names when message arrives (can't show info otherwise anyways)
let objName; //metadata name
//let sensorId; //metadata id
let selSensor // hovered id recognized as sensor 
let id = null; // id of selected/ hovered object (not just sensors)
let sensorID; // Names send by Michael, elements of "allSensors"
let messageID = "";
var objArray = [];
var modalButton = true;
let storage = {};

function listAllSensors() {
    //create the list of all sensors by searching for names (same as in assign color by filtering for first two letters and additionally under a certain character amount)
    objArray = idStructure()
    objArray.forEach(function(element){
        if (element[1].includes("R00") && element[1].length < 7 ){
            var newSensorName = allSensors.push(element[1])
        }
    })
    objArray.forEach(function(element){
        if (element[1].includes("US") && element[1].length < 7 ){
            var newSensorName = allSensors.push(element[1])
        }
    })
    return allSensors
}

function show_some_information_init() {

    console.log("init info")
    allSensors = listAllSensors()
    console.log(allSensors);
    let iframe = document.getElementById('embeddedViewer');
    let viewer = iframe.contentWindow.bimViewer.viewer;
    let metaObjects = viewer.metaScene.metaObjects;
    //let ObjectList = Object.entries(metaObjects); // --> neccessary?
    const allObjects = Object.values(metaObjects);

    allObjects.forEach(function(element){
        var newLength = objArray.push([element.type, element.name, element.id]); 
        
    });
    /*
    viewer.cameraControl.on("hover", (e) => {
        id = e.entity.id;
        // console.log(e)
    }); */
    // iframe.onload = function () {
    console.log("iframe onlaod")
    //get id of selected object
    viewer.cameraControl.on("hover", (e) => {
        id = e.entity.id;
    });
    
    //filter sensors from other objects 

    // activated on clicking an object (activation and recognition of the sensor id and name works works) BUT does so with every object on every kind of mouseclick
    viewer.scene.input.on("mouseup", e => {
        objArray.forEach(function(element){
            if (element[2] === id){
                objName = element[1];
            }
        });
        if (allSensors.includes(objName)) {
            selSensor = id;
            console.log("Name: " + objName);
            console.log("ID: " + selSensor);
            // now activate the modal in modal.js
            modalButton = true
        }

    });
 
    // }
}
//experiment
function activateModal(modalButton){
    return modalButton
}

//called when message arrives at /detail
function update_info(message) {
    //message here is not the same as in on message arrived!
    console.log(message); // loggs as a JS object

    sensorID = message.sensorID;
    console.log(message.sensorID);


    let iframe = document.getElementById('embeddedViewer');
    let viewer = iframe.contentWindow.bimViewer.viewer;
    let metaObjects = viewer.metaScene.metaObjects;
    //let ObjectList = Object.entries(metaObjects); // --> neccessary?
    const allObjects = Object.values(metaObjects);

    // add sensor name to the pool of sensors (to enable the hovering in other function)
    /*if (!allSensors.includes(sensorID)){
        let newSensorName = allSensors.push(sensorID);
    }
    console.log(allSensors);*/
    //console.log(allObjects);
    allObjects.forEach(function(element){
        var newLength = objArray.push([element.type, element.name, element.id]); 
        
    });
    objArray.forEach(function(element){
        if (element.includes(sensorID)){
            messageID = element[2]
        }
    });
    console.log(selSensor); //to get those equal -> click sensor, then wait for message to arrive for this sensor
    console.log(messageID);
    if (messageID === selSensor) {
        console.log("same");
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

function collectInfo(message){
    //collect info from messages
    
    if (Object.keys(storage).length === 0){
        for (var i = 0; i < allSensors.length; i++ ){
            storage[allSensors[i]] = [] //--> creates object of arrays with sensor names as keys
        }
        console.log("storage can be filled now")
    }

    // IMPORTANT?: the order is changed, object in alphabetical order unlike allSensors array!
    sensorID = message.sensorID;

    storage[sensorID].push([new Date(), message.depth, message.standard]); // adds new info at the end
    if (storage[sensorID].length > 6){
        //delete oldest entry
        let tooOld = storage[sensorID].shift()
    }
    console.log(storage)
}
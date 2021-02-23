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

function createModals(){
    //create modals from each sensor, later add content
    //append in modal_group
    allSensors = listAllSensors();
    let mod_group = document.getElementById("modal_group")
    let div_overlay = document.createElement("div")
    div_overlay.setAttribute('id', "overlay");
    allSensors.forEach(function(element){
        let div_mod = document.createElement("div");
        div_mod.setAttribute('class', "modal"); // only active for testing!
        div_mod.setAttribute('id', "modal-"+element);
        let div_head = document.createElement("div"); 
        div_head.setAttribute('class', "header"); 
        let div_title = document.createElement("div");
        div_title.setAttribute('class', "title"); 
        let title = document.createTextNode("Current Status of Sensor " + element)
        let but_close = document.createElement("button");
        but_close.setAttribute('class', "close-button"); 
        but_close.setAttribute('data-close-button', " ");
        but_close.innerHTML = '&times;'
        let div_body = document.createElement("div");
        div_body.setAttribute('class', "modal-body"); 
        div_body.setAttribute('id', "body-" + element);

        //bind together
        mod_group.appendChild(div_mod);
        mod_group.appendChild(div_overlay); // --> neccessary?
        div_mod.appendChild(div_head);
        div_head.appendChild(div_title);
        div_title.appendChild(title);
        div_head.appendChild(but_close);
        div_mod.appendChild(div_body);

        // add the pre-message text 
        let info_value = document.createTextNode("Value: "+"---");
        let info_status = document.createTextNode("Status: " + "---");
        let info_date = document.createTextNode("Time: " + "---")
        let br1 = document.createElement("br");
        let br2 = document.createElement("br");
        div_body.appendChild(info_value);
        div_body.appendChild(br1);
        div_body.appendChild(info_status);
        div_body.appendChild(br2);
        div_body.appendChild(info_date);
    })

}

function show_some_information_init() {

    console.log("init info")
    //allSensors = listAllSensors()
    console.log(allSensors);
    let iframe = document.getElementById('embeddedViewer');
    let viewer = iframe.contentWindow.bimViewer.viewer;
    let metaObjects = viewer.metaScene.metaObjects;
    //let ObjectList = Object.entries(metaObjects); // --> neccessary?
    const allObjects = Object.values(metaObjects);

    allObjects.forEach(function(element){
        var newLength = objArray.push([element.type, element.name, element.id]); 
        
    });

    // add sensors to the dropdown
    let navSensors = document.getElementById("allSensors")
    allSensors.forEach(function(element){
        let li_sensor = document.createElement("li");
        let a_sensor = document.createElement("a");
        // fill a with the list content:  href="#" data-modal-target="#modal">SensorID#1
        a_sensor.textContent = element;
        a_sensor.setAttribute('href', "#modal-"+ element); 
        a_sensor.setAttribute('data-modal-target', "#modal-" + element);
        a_sensor.setAttribute('id', "id_" + element) // could create seperate modal links here!
        li_sensor.appendChild(a_sensor);
        navSensors.appendChild(li_sensor)
        //console.log("created dropdown item " + element)
    })

    //open and close buttons
    const overlay = document.getElementById('overlay')
    allSensors.forEach(function(element){
        let openModalButton = document.getElementById("id_" + element)
        openModalButton.addEventListener('click', () =>{
            let modal = document.querySelector(button.dataset.modalTarget)
            console.log("clicked on " + element)
            openModal(modal)
        })

    });
    const closeModalButtons = document.querySelectorAll('[data-close-button]')


    closeModalButtons.forEach(button =>{
        button.addEventListener('click', () =>{
            const modal = button.closest('.modal')
            closeModal(modal)
        })

    })

    function openModal(modal){
        if (modal==null) return
        modal.classList.add('active')
        overlay.classList.add('active')
    }

    function closeModal(modal){
        if (modal==null) return
        modal.classList.remove('active')
        overlay.classList.remove('active')
    }

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

        }
        

    });
    console.log(storage)
 
    // }
}

//called when message arrives at /detail
function update_info(message) {

    sensorID = message.sensorID;
    //collect info from messages --> PROBLEM: the output reacts to clicking in former function AND receiving a message here, makes the processing appear longer
    
    if (Object.keys(storage).length === 0){
        for (var i = 0; i < allSensors.length; i++ ){
            storage[allSensors[i]] = [] //--> creates object of arrays with sensor names as keys
        }
        console.log("storage can be filled now")
    }

    let d = new Date();
    let curr_min = d.getMinutes();
    let curr_hour = d.getHours();
    let curr_date = d.getDate();
    let curr_month = d.getMonth() + 1;
    let curr_year = d.getFullYear();
    let date = (curr_year + "-" + curr_month + "-" + curr_date + "  " + curr_hour + ":" + curr_min)

    // replace old modal content with new one
    var bod = document.getElementById("body-"+sensorID)
    bod.childNodes[0].nodeValue = "Value: "+message.value;
    bod.childNodes[1].nodeValue = "Status: "+message.standard;
    bod.childNodes[2].nodeValue = "Time: "+date;

    // IMPORTANT?: the order is changed, object in alphabetical order unlike allSensors array!
    
    storage[sensorID].push([date, message.value, message.standard]); // adds new info at the end
    if (storage[sensorID].length > 6){
        //delete oldest entry
        let tooOld = storage[sensorID].shift()
    }

    console.log(storage)

    if (Object.keys(storage).includes(objName)){ 
        let div_info = document.getElementById("information");
        // add headline
        let info_title = document.createElement("P");
        let gapA = document.createElement("br");
        let gapB = document.createElement("br");
        let title_text = document.createTextNode("Recent changes of Sensor "+objName);
        info_title.appendChild(title_text)
        info_title.appendChild(gapA);
        div_info.appendChild(info_title);
        div_info.appendChild(gapB);
        //create p element with a for loop
        for (var u = 0; u < storage[objName].length; u++ ){ //u is the array with date, value and status
            let p_info = document.createElement("P");
            for (var v = 0; v < storage[objName][u].length; v++){
                let text = document.createTextNode(storage[objName][u][v]); //how to add keys here? (key + whats already there)
                let br = document.createElement("br");
                p_info.appendChild(text);
                p_info.appendChild(br);
            }
            div_info.appendChild(p_info);
            let msg_seperator = document.createElement("br");
            div_info.appendChild(msg_seperator);
            div_info.scrollTop = div_info.scrollHeight;
        }   
    }
  
    //message here is not the same as in on message arrived!
    console.log(message); // loggs as a JS object

    sensorID = message.sensorID;
    console.log(message.sensorID);

    let iframe = document.getElementById('embeddedViewer');
    let viewer = iframe.contentWindow.bimViewer.viewer;
    let metaObjects = viewer.metaScene.metaObjects;
    //let ObjectList = Object.entries(metaObjects); // --> neccessary?
    const allObjects = Object.values(metaObjects);
}

function clear_div_info(){

    let div_info = document.getElementById("information");
    while (div_info.firstChild) {
        div_info.removeChild(div_info.firstChild);
    }
}

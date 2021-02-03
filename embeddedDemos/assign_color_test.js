"use strict";

let current_r = 0;
let current_g = 0;
let current_b = 0;
let color = [1,0,1];


const clientID = "clientID-" + parseInt(Math.random() * 100);
const host = 'broker.emqx.io';
const port = '8084';
// Initialize new Paho client connection
let client = new Paho.MQTT.Client(host, Number(port), clientID);
var csvContent; 



function csvFile(){

    //get my constants 
    let iframeElement = document.getElementById("embeddedViewer");
    let  viewer = iframeElement.contentWindow.bimViewer.viewer;
    let metaObjects = viewer.metaScene.metaObjects;
    
    //access certain parts of metaObjects (skip the second level)
    const allObjects = Object.values(metaObjects);
    var objArray = [["Type", "Name", "Id"]];
    var allTypes = [];
    var allNames = [];
    var allIds = [];
    allObjects.forEach(function(element){
        //element is the variable for each object 
        var newLength = objArray.push([element.type, element.name, element.id]);
        var newType = allTypes.push([element.type]);
        var newName = allNames.push([element.name]);
        var newId = allIds.push([element.id])
    });
    
    allTypes = allTypes.flat(1);
    allNames = allNames.flat(1);
    allIds = allIds.flat(1);
    var yxArray = [allTypes, allNames, allIds]; // might not be needed
    console.log(objArray);
    console.log(yxArray); 
    //console.log(allTypes);
    //console.log(allNames);
    //console.log(allIds);
    //let newObjArray = objArray.unshift(["Type", "Name", "Id"]);
    
    const rows = objArray;
    csvContent = "data:text/csv;charset=utf-8, \n";

    rows.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });
    //console.log(csvContent);
    

    /*
    function myExport (csvContent){
        return csvContent
    };

    // create csv 
    const items = objArray;
    const replacer = (key, value) => value === null ? '' : value; // specify my null value here
    const header = Object.keys(items[0]);
    const csv = [
        header.join(','), //header row first
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer).replace(/\\"/g, '""')).join(','))
    ].join('\r\n');
    
    console.log(csv);

    csv.unshift(fields.join(',')); // add header column
     csv = csv.join('\r\n');
    console.log(csv);
    */
}

function startConnect() {
// Generate a random client ID

    // Fetch the hostname/IP address and port number from the form
    //host = document.getElementById("host").value; -->
    // port = document.getElementById("port").value; -->
    console.log("connecting")
 

    // Set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // Connect the client, if successful, call onConnect function
    client.connect({ 
        onSuccess: onConnect,
        useSSL: true
    });

    console.info(client)
    }

    // Called when the client connects
    function onConnect() {
        // Fetch the MQTT topic from the form
        //topic = document.getElementById("topic").value;

        // Print output for the user in the messages div
        //document.getElementById("messages").innerHTML += '<span>Subscribing to: ' + topic + '</span><br/>';

        // Subscribe to the requested topics

        

        console.log("subscribing");
        const  channel = "rwth/SHMviewer/#" ;
        client.subscribe(channel);
        console.log ("subscribed to "+channel);

    }

    // Called when the client loses its connection
    function onConnectionLost(responseObject) {
    //    <!-- document.getElementById("messages").innerHTML += '<span>ERROR: Connection lost</span><br/>';
    //    if (responseObject.errorCode !== 0) {
    //       document.getElementById("messages").innerHTML += '<span>ERROR: ' + + responseObject.errorMessage + '</span><br/>';
    //   } -->

        console.log("connection lost")
        if (responseObject.errorCode !== 0) {
            console.log(responseObject.errorMessage);
        }
    }
 

// Called when a message arrives
    function onMessageArrived(message) {
        
        //JSON object with two values extracted to elementID/selObj and color 
        
        console.log(message.payloadString);
        let msg = JSON.parse(message.payloadString);
            //console.log(msg);
        let sensor = msg.sensorID;
        let color = msg.color;
        console.log(sensor);
        console.log(color);

        //access the metaObjects array
        // get csv file back (replace Test.csv with Objects.csv) -> this part is already tested and works
        let csvarray = [];
        let client = new XMLHttpRequest();
        client.open('GET', '/embeddedDemos/sensorOverview.csv');
        client.onreadystatechange = function() {
            let rows = client.responseText.split('\r\n');
            for(let i = 0; i < rows.length; i++){
                csvarray.push(rows[i].split(';'));
            }
        }
        client.send();

        // temporary solution, as the forEach function doesn't recognize my actual array
        let selObj = "sensor not connected";
        let myarray = [["IfcBuildingElementProxy", "Umlauf", "2cyTtvWGvF_v0CQVLse3zn", "1"], ["IfcBuildingElementProxy", "Umlauf", "1RtZu2Lh57kP81ZZ59rWcW", "3"], ["IfcBuildingElementProxy", "Water", "2UFCi7SOP2WBqIi4NDVGdu", "4"], ["IfcBuildingElementProxy", "Water", "0In9GSkUj0kAjvuqTrNojT", "2"]];
        //console.log(myarray);
        
        myarray.forEach(function(element){
        //console.log(element[3]);
        if (element.includes(sensor)){
            selObj = element[2];
            //console.log(selObj);https://teams.microsoft.com/l/meetup-join/19:5edeb9de96ad41e0b56e5297692e0ae9@thread.tacv2/1612339346815?context=%7B%22Tid%22:%220ce775f2-67de-4cd2-ba67-819a417e447f%22,%22Oid%22:%2280f33d89-e0f2-4d35-9144-f7b446789b60%22%7D
        }
        });
        console.log(selObj);

        /*
        let selObj = "sensor not connected";
        csvarray.forEach(function(element){
            if (element.includes(sensor)){
              selObj = element;
              console.log(selObj);
            }
          });
        console.log(selObj);
        */


        let iframeElement = document.getElementById("embeddedViewer");
        //console.log(iframeElement);
        let  viewer = iframeElement.contentWindow.bimViewer.viewer;
        //console.log("selected sensor:\r"+ sensor); 
        let metaObjects = viewer.metaScene.metaObjects;
        //console.log (metaObjects);
        //console.log (csvContent);
        let ObjectList = Object.entries(metaObjects);
        console.log (ObjectList); // not working well
        let myItem = metaObjects[String(selObj)];
        console.log(myItem.id); // breaks the script
        let entity = viewer.scene.objects[myItem.id];


        entity.colorize = color;
        console.log("test")
       

    }

// Called when the disconnection button is pressed
function startDisconnect() {
    client.disconnect();
    document.getElementById("messages").innerHTML += '<span>Disconnected</span><br/>';
}


// starts an interval event to monitor the load status of the model


function loadMonitor(){
    var countInterval = 0;
    var loaderInt = window.setInterval( function(){
        countInterval = countInterval + 1; //alternative: countIntervall++
        const iframeBaseURL = "./../app/index.html?projectId=WaterLock";
        let iframeElement = document.getElementById("embeddedViewer");
        if (!iframeElement) {
            throw "IFRAME not found";
        }
    
        let viewer = iframeElement.contentWindow.bimViewer; 
        // is the model loaded?
        if (viewer.isModelLoaded("design")){
            console.log("loading completed");
            // attention: Hard coded model name!!! ('design'), please change for other models or make parameter for function
            //console.log(`model loaded is ${viewer.isModelLoaded("design")} ${window.loadMonitorID}`);
            
            // remove the interval 
            window.clearInterval(loaderInt);
            console.log(`model loaded`);

            csvFile();
            console.log("csv created") //tests for successful csvFile() execution
                            
        } else if (countInterval === 5){
            window.clearInterval(loaderInt)
            console.log("loading failed") 
        } else {
            console.log('waiting to load model....')
        }
    }, 1000);
}   


function init() {

    loadMonitor ();
    

    startConnect();
    const iframeBaseURL = "./../app/index.html?projectId=WaterLock";
    let iframeElement = document.getElementById("embeddedViewer");
    if (!iframeElement) {
        throw "IFRAME not found";
    }
    iframeElement.src = iframeBaseURL;

    const objectIdsUsed = {};

    window.changeColorByMQTT = function (checkbox) {

            console.log(checkbox)
            viewer = iframeElement.contentWindow.bimViewer.viewer;

            console.log(viewer.metaScene.metaObjects["12NjfiY$5BWxO3cGvRvhMM"])

            //var obj = viewer.scene.components[entity.id];
            var obj = viewer.scene.objects["12NjfiY$5BWxO3cGvRvhMM"];
            var res= obj.colorize = [1,0,0] ;
            for (selObj in viewer.scene.selectedObjects ){

                console.log(selObj, obj);

                viewer.scene.selectedObjects[selObj].colorize = [1,0,0];
                viewer.scene.selectedObjects[selObj].selected = false; 
            };
            //teapotMesh.visible = false; -->
            //   material = new PhongMaterial(scene, {
            //       id: "myMaterial",
            //       diffuse: [0.2, 0.2, 1.0]
            //   })
            //   var teapotMaterial = viewer.scene.components["myMaterial"];
            var material = obj.material;
            //  teapotMesh.material = teapotMaterial;
            ///material.diffuse = [1,0,0]; // Change to red
            //obj.material = material;
            obj.meshes[0]._color=[1,0,0,0];
    }
    window.selectObject = function (checkbox) {

        const objectId = checkbox.name;

        if (checkbox.checked) {
            objectIdsUsed[objectId] = true;
        } else {
            delete objectIdsUsed[objectId];
        }

        const objectIds = Object.keys(objectIdsUsed);

        if (objectIds.length === 0) {
            iframeElement.src = iframeBaseURL + "#actions=clearFocusObjects";
        } else {
            const objectIdsParam = objectIds.join(",");
            iframeElement.src = iframeBaseURL + "#actions=focusObjects,openTab&objectIds=" + objectIdsParam + "&tabId=objects";
        }
    }

/*
    scene.input.on("mouseclicked", function (coords) {
        var hit = scene.pick({ canvasPos: coords }); if (hit) { var entity = hit.entity; var metaObject = viewer.metaScene.metaObjects[entity.id]; if (metaObject) { console.log(JSON.stringify(metaObject.getJSON(), null, "\t")); } else { const parent = entity.parent; if (parent) { metaObject = viewer.metaScene.metaObjects[parent.id]; if (metaObject) {
                        console.log(JSON.stringify(metaObject.getJSON(), null, "\t"));
                    }
                }
            }
        }
    });
*/
} 
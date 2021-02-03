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

console.log("test no func");

/*function myFuncTine(){
    console.log("test");    
    // get metaObjects

    // create csv 
    let json = metaObjects.items;
    let fields = Object.keys(json[0]);
    let replacer = function(key, value) { return value === null ? '' : value };
    let csv = json.map(function(row){
        return fields.map(function(fieldName){
            return JSON.stringify(row[fieldName], replacer)
        }).join(',')
    });
    csv.unshift(fields.join(',')); // add header column
     csv = csv.join('\r\n');
    console.log(csv);

    // get csv file back
    let csvarray = [];
    let client = new XMLHttpRequest();
    client.open('GET', '/docs/Test.csv');
    client.onreadystatechange = function() {
        let rows = client.responseText.split('\n');
        for(let i = 0; i < rows.length; i++){
            csvarray.push(rows[i].split(','));
        }
    }
    client.send();
    console.log(csvarray);
}*/

/*
--- faulty interval function from prof---

function loadMonitor() {
    return window.setInterval( function() {
        // try{
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
            console.log(`model loaded is ${viewer.isModelLoaded("design")} ${window.loadMonitorID}`);
            csvFile();
            // console.log(`model loaded is ${viewer.isModelLoaded("design")} ${window.loadMonitorID}`)

            // remove the interval 
            window.clearInterval(window.loadMonitorID)    
        }
        else
        {
            console.log('waiting to load model....')
        }
        // }
        // catch {
        
        // }
    }, 3000 );
};
------------------
*/

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
        
        //will try setting those to const and put the "create csv" part earlier in the script, maybe with my own function
        let iframeElement = document.getElementById("embeddedViewer");
        let  viewer = iframeElement.contentWindow.bimViewer.viewer;
        let metaObjects = viewer.metaScene.metaObjects;
        console.log(metaObjects["id", "name", "type"]);
/*
        // create csv 
        const items = metaObjects["id", "name", "type"];
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
        // need to save csv somewhere?
        
        // in Excel(?): add the sensorID collumn  
        
        // get csv file (replace Test.csv with Objects.csv) -> this part is already tested and works
        let csvarray = [];
        let client = new XMLHttpRequest();
        client.open('GET', '/docs/Test.csv');
        client.onreadystatechange = function() {
            let rows = client.responseText.split('\n');
            for(let i = 0; i < rows.length; i++){
                csvarray.push(rows[i].split(','));
            }
        }
        client.send();
        console.log(csvarray);  */

        // (where message has to arrive latest)
        //JSON object with two values extracted to sensorID and color 
        
            console.log(message.payloadString);
            let msg = JSON.parse(message.payloadString);
             //console.log(msg);
            let sensor = msg.sensorID;
            let color = msg.color;
            console.log(sensor);
            console.log(color);

            //get element from sensor -> only for testing until real swap! 
            function Exchange (sensor){
                return sensor === USL01 ? "2_BxCgw6zEARAkB6iaS_fp" 
                    : sensor === R001 ? "0In9GSkUj0kAjvuqTrNojT"
                    : console.log("no sensor connected");
            }
            
            let selObjTest = Exchange(sensor);
            console.log(selObjTest);
            
            // extended exchange from sensorID to elementID
            // find position of certain sensorID
            let index = csvarray.indexOf(sensor);
            console.log(index)
            // find elementID at same position 
            // if the index is a number that gives the placement of the whole inner object:
            let selObj = csvarray.index.elementID
            console.log(selObj)
        
            //console.log(iframeElement);
            
            console.log("selected Object:\r"+ selObj); 
            
            console.log (metaObjects);
            let ObjectList = Object.entries(metaObjects);
            console.log (ObjectList);
            let myItem = metaObjects[String(selObj)];
            console.log(myItem.id);
            let entity = viewer.scene.objects[myItem.id];


            entity.colorize = color;
            console.log("test")
        

    }

// Called when the disconnection button is pressed
function startDisconnect() {
    client.disconnect();
    document.getElementById("messages").innerHTML += '<span>Disconnected</span><br/>';
}

    function init() {

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
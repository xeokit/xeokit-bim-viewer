"use strict";

let current_r = 0;
let current_g = 0;
let current_b = 0;
let color = [1, 0, 1];


const clientID = "clientID-" + parseInt(Math.random() * 100);
const host = 'broker.emqx.io';
const port = '8084';

const ultrasonicSensor = "1bjALNe19BcO68YoPIpOu_";
const depthSensor0 = "0nv5bie5r4AhhkrCbVL$Wn";
const depthSensor1 = "25s0jSmSH4whopLALj9wxv";
const depthSensor2 = "2oJVCaCyn2xPl5kA2E22TU";

// Initialize new Paho client connection
let client = new Paho.MQTT.Client(host, Number(port), clientID);


function startConnect() {
// Generate a random client ID

    // Fetch the hostname/IP address and port number from the form
    //host = document.getElementById("host").value; -->
    // port = document.getElementById("port").value; -->
    console.log("connecting")


    // Set callback handlers
    // client.onConnectionLost = onConnectionLost;
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

    // Subscribe to the requested topic

    console.log("subscribing");
    const channel = "rwth/color/#";
    client.subscribe(channel);
    console.log("subscribed to " + channel);
}

// Called when the client loses its connection
function onConnectionLost(responseObject) {
    //    <!-- document.getElementById("messages").innerHTML += '<span>ERROR: Connection lost</span><br/>';
    //    if (responseObject.errorCode !== 0) {
    //       document.getElementById("messages").innerHTML += '<span>ERROR: ' + + responseObject.errorMessage + '</span><br/>';
    //   } -->

    console.log("connection lost")
}

// Called when a message arrives
function onMessageArrived(message) {
    console.log(message.payloadString)

    let iframeElement = document.getElementById("embeddedViewer");
    let color = JSON.parse(message.payloadString);
    console.log(color["color"]);
    console.log(JSON.parse(message.payloadString));
    console.log(iframeElement);
    let viewer = iframeElement.contentWindow.bimViewer.viewer;
    console.log("selected Objects:\r" + viewer.scene.selectedObjects);
    for (let selObj in viewer.scene.selectedObjects) {
        console.log(selObj);
        viewer.scene.selectedObjects[selObj].colorize = color["color"];
        viewer.scene.selectedObjects[selObj].colorize = color["color"];
        const objectIds = viewer.metaScene.getObjectIDsInSubtree(selObj);
        viewer.scene.selectedObjects[selObj].selected = false;
        // const dmax = math.lenVec3(dir);
        // let d = 0;

        // const onTick = scene.on("tick", () => {
        //     d += 0.75;
        //     if (d > dmax) {
        //         scene.off(onTick);
        //         if (done) {
        //             done();
        //         }
        //         return;
        //     }
        //     scene.setObjectsOffset(objectIds, math.mulVec3Scalar([1,9,1], (d / dmax), []));
        // });
    }
    ;
    //document.getElementById("messages").innerHTML += '<span>Topic: ' + message.destinationName + '  | ' + message.payloadString + '</span><br/>';


//        color = message.payloadString.getJSON["color"];
//        console.log(color);

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

    var iframe = document.getElementById('embeddedViewer');


    iframe.onload = function () {
        var viewer = iframeElement.contentWindow.bimViewer.viewer;
        var id = null;
        var flag = true;
        viewer.cameraControl.on("hover", (e) => {
            if(flag){
                console.log("over");
                id = e.entity.id;
            }
        });

        viewer.scene.input.on("mouseup", e => {

            if (id === ultrasonicSensor || id === depthSensor0 || id === depthSensor1 || id === depthSensor2) {
                id = 0;
                flag = false;
                alert("this is a sensor");
            }
            console.log(id);
        });

        viewer.scene.input.on("mousedown", e => {

            flag = true;
        });

        viewer.cameraControl.on("hoverOff", (e) => {
            id = 0;
        });
    }
}

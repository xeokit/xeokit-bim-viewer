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
        const  channel = "rwth/color/#" ;
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
    }

// Called when a message arrives
    function onMessageArrived(message) {

        function init() {

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
            
            
        
        }    //let color = JSON.parse(message.payloadString);
        //console.log(color["color"]);
        console.log(message.payloadString);
        let msg = JSON.parse(message.payloadString);
        //console.log(msg);
        let selObj = msg.elementID;
        let color = msg.color;
        console.log(selObj);
        console.log(color);
        let iframeElement = document.getElementById("embeddedViewer");
        //console.log(iframeElement);
        let  viewer = iframeElement.contentWindow.bimViewer.viewer;
        //console.log("selected Objects:\r"+ viewer.scene.selectedObjects);
        //for (let selObj in viewer.scene.selectedObjects ){
                //console.log (viewer.scene.selectedObjects[selObj].colorize);
                viewer.scene.selectedObjects[selObj].colorize = color;
                //viewer.scene.selectedObjects[selObj].colorize = color;
                //viewer.scene.selectedObjects[selObj].colorize = color["color"];
                //const objectIds = viewer.metaScene.getObjectIDsInSusbtree(selObj);
                //viewer.scene.selectedObjects[selObj].selected = false; 
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
                //};
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
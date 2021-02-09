"use strict";

const ultrasonicSensor = "1bjALNe19BcO68YoPIpOu_";
const depthSensor0 = "0nv5bie5r4AhhkrCbVL$Wn";
const depthSensor1 = "25s0jSmSH4whopLALj9wxv";
const depthSensor2 = "2oJVCaCyn2xPl5kA2E22TU";

let current_sensor_ID = "";

function show_some_information_init() {

    let iframe = document.getElementById('embeddedViewer');

    iframe.onload = function () {
        let viewer = iframe.contentWindow.bimViewer.viewer;
        let id = null;
        viewer.cameraControl.on("hover", (e) => {
            id = e.entity.id;
        });

        viewer.scene.input.on("mouseup", e => {
            if (id === ultrasonicSensor || id === depthSensor0 || id === depthSensor1 || id === depthSensor2) {
                current_sensor_ID = id;
            }
            console.log(id);
        });

    }
}

function update_info(message) {
    console.log(message);

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

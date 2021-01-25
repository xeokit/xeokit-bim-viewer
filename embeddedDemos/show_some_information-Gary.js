"use strict";

const ultrasonicSensor = "1bjALNe19BcO68YoPIpOu_";
const depthSensor0 = "0nv5bie5r4AhhkrCbVL$Wn";
const depthSensor1 = "25s0jSmSH4whopLALj9wxv";
const depthSensor2 = "2oJVCaCyn2xPl5kA2E22TU";

function show_some_information_init() {

    var iframe = document.getElementById('embeddedViewer');


    iframe.onload = function () {
        var viewer = iframe.contentWindow.bimViewer.viewer;
        var id = null;
        var flag = true;
        viewer.cameraControl.on("hover", (e) => {
            if(flag){
                console.log("over");
                id = e.entity.id;
            }
        });

        viewer.scene.input.on("mousedown", e => {
            flag = true;

        });

        viewer.scene.input.on("mouseup", e => {

            if (id === ultrasonicSensor || id === depthSensor0 || id === depthSensor1 || id === depthSensor2) {
                id = 0;
                flag = false;
                alert("this is a sensor");
            }
            console.log(id);
        });

    }
}

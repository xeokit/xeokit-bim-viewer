import {Controller} from "../Controller.js";

class FirstPersonMode extends Controller {

    constructor(parent, cfg) {

        super(parent, cfg);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        const buttonElement = cfg.buttonElement;
        const cameraControl = this.viewer.cameraControl;

        cameraControl.firstPerson = false;
        cameraControl.pivoting = true;
        cameraControl.panToPointer = true;

        this.on("enabled", (enabled) => {
            if (!enabled) {
                buttonElement.addClass("disabled");
            } else {
                buttonElement.removeClass("disabled");
            }
        });

        this.on("active", (active) => {
            if (active) {
                buttonElement.addClass("active");
            } else {
                buttonElement.removeClass("active");
            }
        });

        this.on("active", (active) => {
            if (active) {
                cameraControl.firstPerson = true;
                cameraControl.panToPointer = true;
                cameraControl.pivoting = false;
            } else {
                cameraControl.firstPerson = false;
                cameraControl.pivoting = true;
                cameraControl.panToPointer = true;
            }
            this.viewer.cameraControl.planView = false;
        });

        buttonElement.on('click', (event) => {
            if (!this.getEnabled()) {
                return;
            }
            const active = this.getActive();
            this.setActive(!active);
            event.preventDefault();
        });

        this.viewerUI.on("reset", ()=>{
            this.setActive(false);
        });
    }
}

export {FirstPersonMode};
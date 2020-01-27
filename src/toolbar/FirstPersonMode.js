import {Controller} from "../Controller.js";

/** @private */
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
                buttonElement.classList.add("disabled");
            } else {
                buttonElement.classList.remove("disabled");
            }
        });

        this.on("active", (active) => {
            if (active) {
                buttonElement.classList.add("active");
            } else {
                buttonElement.classList.remove("active");
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

        buttonElement.addEventListener("click", (event) => {
            if (!this.getEnabled()) {
                return;
            }
            const active = this.getActive();
            this.setActive(!active);
            event.preventDefault();
        });

        this.bimViewer.on("reset", ()=>{
            this.setActive(false);
        });
    }
}

export {FirstPersonMode};
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
        const cameraControlNavModeMediator = cfg.cameraControlNavModeMediator;

        cameraControl.navMode = "orbit";
        cameraControl.pivoting = true;
        cameraControl.dollyToPointer = true;

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
            cameraControlNavModeMediator.setFirstPersonModeActive(active);
            if (active) {
                cameraControl.dollyToPointer = true;
                cameraControl.pivoting = false;
            } else {
                cameraControl.pivoting = true;
            }
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
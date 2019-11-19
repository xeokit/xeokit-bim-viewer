import {Controller} from "../Controller.js";

class OrthoMode extends Controller {

    constructor(parent, cfg) {

        super(parent, cfg);

        if (!cfg.buttonElement) {
            throw "Missing config: buttonElement";
        }

        const buttonElement = cfg.buttonElement;

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
                this.viewer.cameraFlight.flyTo({projection: "ortho", duration: 0.5}, () => {});
            } else {
                this.viewer.cameraFlight.flyTo({projection: "perspective", duration: 0.5}, () => {});
            }
            this.viewer.cameraControl.planView = false;
        });
        
        buttonElement.on('click', (event) => {
            this.setActive(!this.getActive());
            event.preventDefault();
        });

        this.viewerUI.on("reset", ()=>{
            this.setActive(false);
        });
    }
}

export {OrthoMode};
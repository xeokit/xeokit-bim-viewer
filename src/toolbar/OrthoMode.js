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
                this.viewer.cameraFlight.flyTo({projection: "ortho", duration: 0.5}, () => {});
            } else {
                this.viewer.cameraFlight.flyTo({projection: "perspective", duration: 0.5}, () => {});
            }
        });
        
        buttonElement.addEventListener("click", (event) => {
            this.setActive(!this.getActive());
            event.preventDefault();
        });

        this.viewerUI.on("reset", ()=>{
            this.setActive(false);
        });
    }
}

export {OrthoMode};